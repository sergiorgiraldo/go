# Create your own functions

You can write your own JavaScript functions to run with the content of block or selection.

To learn more: http://edna.arslexis.io/help#write-your-own-functions

This special note named `edna: my functions` contains your custom functions.

Each function is a JavaScript block.

Below is a block with a simple function to use as a template.

Share your functions with others at https://github.com/kjk/edna/discussions/categories/share-javascript-functions

∞∞∞javascript
/**
{
  "api":1,
  "name":"My Camel Case",
  "description":"My function to convert text to CamelCase",
  "author":"Me",
  "icon":"quote",
  "tags":"convert"
}
**/

async function main(input) {
  let lodash = (await import("https://esm.sh/lodash@4.17.21")).default;
  input.text = lodash.camelCase(input.text);
}
