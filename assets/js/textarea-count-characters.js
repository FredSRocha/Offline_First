// http://blog.routydevelopment.com/2010/10/count-utf-8-bytes-in-javascript/
function byteLength (txt) {
    var escapedStr = encodeURI(txt);
    if (escapedStr.indexOf("%") != -1) {
      var count = escapedStr.split("%").length - 1;
      if (count == 0) count++; 
      var tmp = escapedStr.length - (count * 3);
      count = count + tmp;
    } else {
      count = escapedStr.length;
    }
    // newlines count double, to account for windows CRLF
    return count + (txt.split("\n").length-1);
  }
  
  function charCountInit() {
    const textareas = document.querySelectorAll("textarea[data-maxchar]");
  
    for (const textarea of textareas) {
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      textarea.parentNode.insertBefore(wrapper, textarea);
      wrapper.appendChild(textarea);
  
      const charCountEl = document.createElement("div");
      charCountEl.classList.add("char-count");
      wrapper.appendChild(charCountEl);
  
      textarea.addEventListener("keyup", function () {
        const value = this.value;
        const byteLength = value.length; // byteLength is deprecated, use value.length
  
        const maxLength = parseInt(this.dataset.maxchar, 10);
        charCountEl.textContent = `${byteLength} / ${maxLength}`;
  
        charCountEl.style.color = byteLength > maxLength ? "red" : "";
      });
  
      textarea.dispatchEvent(new KeyboardEvent("keyup")); // Simulate initial keyup
    }
  }
  
  charCountInit();
  