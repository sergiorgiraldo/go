package main

import (
	"io"
	"net/http"
)

func serveInternalError(w http.ResponseWriter, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	io.WriteString(w, err.Error())
}

func tempRedirect(w http.ResponseWriter, r *http.Request, newURL string) {
	http.Redirect(w, r, newURL, http.StatusTemporaryRedirect)
}

func serveJSON(w http.ResponseWriter, data []byte) {
	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}
