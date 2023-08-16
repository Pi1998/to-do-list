// Function to handle the "Clear all completed" button
export default function setupClearButton(tasks, updateIndexes, saveAndRender) {
  tasks = tasks.filter((task) => !task.completed);
  updateIndexes();
  saveAndRender();

  return tasks; // Return the updated tasks array
}

export function attachCheckboxChangeEvent(checkbox, task, save) {
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    save();
  });
}
