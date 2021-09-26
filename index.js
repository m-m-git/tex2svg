/**
 * Convert the TeX expression to SVG.
 * @param {string} texString the TeX expression.
 * @param {object} options options. see https://docs.mathjax.org/en/latest/web/typeset.html#conversion-options
 * @returns {string} a SVG string.
 */
function convertTex2SVG(texString, options = { em: 16, display: true }) {
  const regexpSVG = /<svg[\s\S]*?<\/svg>/;
  const mjxContainerElement = MathJax.tex2svg(texString, options);
  const found = mjxContainerElement.innerHTML.match(regexpSVG);
  return found[0];
};

window.MathJax = {
  loader: { load: ['[tex]/physics'] },
  tex: {
    packages: { '[+]': ['physics'] },
  },
  options: {
    enableMenu: false
  },
  startup: {
    ready: () => {
      MathJax.startup.defaultReady();
      MathJax.startup.promise.then(() => {
        const eulerNum = "\\begin{align*}\ne &= \\lim_{n \\to \\infty} \\left( 1 + \\frac{1}{n} \\right)^n \\\\\n&= 2.718 \\ldots\n\\end{align*}";
        const srcTextarea = document.getElementById("src");
        srcTextarea.value = eulerNum;
        srcTextarea.focus();
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", (event) => {
  const preview = document.getElementById("preview");
  const srcTextarea = document.getElementById("src");
  const resultTextarea = document.getElementById("result");
  const copyBtn = document.getElementById("copyBtn");
  const saveBtn = document.getElementById("saveBtn");

  const inputEventListener = function (event) {
    const svgString = convertTex2SVG(srcTextarea.value);
    preview.innerHTML = svgString;
    resultTextarea.value = svgString;
  };

  srcTextarea.addEventListener("input", inputEventListener);
  srcTextarea.addEventListener("focus", inputEventListener);
  srcTextarea.addEventListener("blur", inputEventListener);

  copyBtn.addEventListener("click", (event) => {
    resultTextarea.focus();
    resultTextarea.select();
    navigator.clipboard.writeText(resultTextarea.value);
  });

  saveBtn.addEventListener("click", (event) => {
    const blob = new Blob([resultTextarea.value], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1729);
  });
});