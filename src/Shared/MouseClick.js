// from https://stackoverflow.com/a/54316368

const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
export default function simulateMouseClick(element) {
  mouseClickEvents.forEach(mouseEventType =>
    element.dispatchEvent(
      new MouseEvent(mouseEventType, {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1
      })
    )
  );
}
