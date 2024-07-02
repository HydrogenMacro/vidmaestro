const $ = document.querySelector.bind(document);
const input = $("textarea");
const generateBtn = $("#generate");

generateBtn.onclick = () => {
  parse(input.value)
}
const VALID_VARNAME = new Symbol("varname");
const ANY = new Symbol("any");
const NUMBER = new Symbol("number");
const states = {
  start: ["\"", ANY],
  wrappedFieldName: ["\"", ANY],
  afterWrappedFieldName: ["(", ":"],
  displayName: [VALID_VARNAME, ")"],
  afterDisplayName: [":"],
  baseTypes: ["String", "Number", "Component", "Bool", "Color"],
  afterBaseTypes: ["[", "@", ",", "="],
  arrayModifier: [NUMBER, "~", "]"],
  arrayModifierAfterTilde: [NUMBER, "]"],
  afterArrayModifier: ["@", "<", ","],
  afterBaseType: ["=", "@", ","],
  baseTypeDefault: ["\"", ANY],
  afterBaseTypeDefault: [],
  
};
function parse(attrText) {
  let i = 0;
  
}
/*
"Z Index"(zIndex): Number[2~5]@-1~4
abc: Bool=true
position: Number[2]<X@-1~4, Y@-1~4>
*/