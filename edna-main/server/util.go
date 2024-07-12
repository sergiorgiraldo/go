package main

import (
	"context"
	"fmt"
	"io/fs"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"syscall"

	"github.com/kjk/common/u"
)

var (
	f          = fmt.Sprintf
	e          = fmt.Errorf
	must       = u.Must
	panicIf    = u.PanicIf
	panicIfErr = u.PanicIfErr
	isWinOrMac = u.IsWinOrMac
	isLinux    = u.IsLinux
	formatSize = u.FormatSize
)

func ctx() context.Context {
	return context.Background()
}

func push[S ~[]E, E any](s *S, els ...E) {
	*s = append(*s, els...)
}

func copyFilesRecurMust(srcDir, dstDir string) {
	logf("copyFilesRecurMust('%s', '%s')\n", srcDir, dstDir)
	srcDirLen := len(srcDir)
	nCopied := 0
	onFile := func(path string, de fs.DirEntry) (bool, error) {
		dstPath := filepath.Join(dstDir, path[srcDirLen:])
		err := u.CopyFile(dstPath, path)
		panicIfErr(err)
		//logf("copied '%s' to '%s'\n", path, dstPath)
		nCopied++
		return false, nil
	}
	u.IterDir(srcDir, onFile)
	logf("copied %d files\n", nCopied)
}

func startLoggedInDir(dir string, exe string, args ...string) (func(), error) {
	cmd := exec.Command(exe, args...)
	cmd.Dir = dir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	logf("running: %s in dir '%s'\n", cmd.String(), cmd.Dir)
	err := cmd.Start()
	if err != nil {
		return nil, err
	}
	return func() {
		cmd.Process.Kill()
	}, nil
}

func waitForSigIntOrKill() {
	// Ctrl-C sends SIGINT
	sctx, stop := signal.NotifyContext(ctx(), os.Interrupt /*SIGINT*/, os.Kill /* SIGKILL */, syscall.SIGTERM)
	defer stop()
	<-sctx.Done()
}

func printFS(fsys fs.FS, startDir string) {
	logf("printFS('%s')\n", startDir)
	dfs := fsys.(fs.ReadDirFS)
	nFiles := 0
	u.IterReadDirFS(dfs, startDir, func(filePath string, d fs.DirEntry) error {
		logf("%s\n", filePath)
		nFiles++
		return nil
	})
	logf("%d files\n", nFiles)
}

func updateGoDeps(noProxy bool) {
	{
		cmd := exec.Command("go", "get", "-u", ".")
		cmd.Dir = "server"
		if noProxy {
			cmd.Env = append(os.Environ(), "GOPROXY=direct")
		}
		logf("running: %s in dir '%s'\n", cmd.String(), cmd.Dir)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		err := cmd.Run()
		panicIf(err != nil, "go get failed with '%s'", err)
	}
	{
		cmd := exec.Command("go", "mod", "tidy")
		cmd.Dir = "server"
		logf("running: %s in dir '%s'\n", cmd.String(), cmd.Dir)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		err := cmd.Run()
		panicIf(err != nil, "go get failed with '%s'", err)
	}
}

func runLoggedInDir(dir string, exe string, args ...string) error {
	cmd := exec.Command(exe, args...)
	cmd.Dir = dir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	logf("running: %s in dir '%s'\n", cmd.String(), cmd.Dir)
	err := cmd.Run()
	return err
}
