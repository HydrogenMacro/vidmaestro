import "./parsegraph.js";
const $ = document.querySelector.bind(document);
const input = $("textarea");
const generateBtn = $("#generate");

generateBtn.onclick = () => {
  parse(input.value)
}

function parse(attrText) {
  let i = 0;
  
}
