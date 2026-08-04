const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projectRows = [...document.querySelectorAll("[data-project-status]")];

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    for (const candidate of filterButtons) {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    }

    for (const row of projectRows) {
      const statuses = row.dataset.projectStatus?.split(/\s+/) ?? [];
      row.hidden = filter !== "all" && !statuses.includes(filter);
    }
  });
}
