$(function () {
  setValueVh(); // set --vh

  /***/
  /***/
  function setValueVh() {
    let width = window.innerWidth;
    let vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
      setTimeout(() => {
        if (width != window.innerWidth) {
          let vh = window.innerHeight;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
          width = window.innerWidth;
        }
      }, 50);
    });
  };
});
