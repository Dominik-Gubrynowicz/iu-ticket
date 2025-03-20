export default function useDrag(onDrop) {
  // Prevent default behavior to allow drop
  const dragOverHandler = (e) => {
    e.preventDefault();
  };

  // Handle the drop event and call the provided onDrop callback
  const dropHandler = (e) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('ticketId');
    if (ticketId) {
      onDrop(ticketId);
    }
  };

  return {
    dragOverHandler,
    dropHandler
  };
}