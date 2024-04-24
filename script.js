document.addEventListener("DOMContentLoaded", () => {
  const degreeSelect = document.getElementById("degreeSelect")

  // Add default option as the first item
  const defaultOption = document.createElement("option")
  defaultOption.value = ""
  defaultOption.textContent = "เลือกวุฒิการศึกษาที่บรรจุ" // "Select Degree"
  defaultOption.disabled = true // Make it unselectable
  defaultOption.selected = true // Make it the selected default option
  degreeSelect.appendChild(defaultOption)

  // Extract unique degrees from the salaryData and append as dropdown options
  const uniqueDegrees = [...new Set(salaryData.map((item) => item.degree))]
  uniqueDegrees.forEach((degree) => {
    const option = document.createElement("option")
    option.value = degree
    option.textContent = degree
    degreeSelect.appendChild(option)
  })

  // Style the select element itself to ensure the selected value is displayed correctly
  degreeSelect.style.cssText =
    "max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
})

$(document).ready(function () {
  $("#degreeSelect").select2({
    placeholder: "เลือกวุฒิการศึกษาที่บรรจุ",
    dropdownCssClass:
      "max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;", // This is for customizing the dropdown
  })
})


document
  .getElementById("salaryCalcForm")
  .addEventListener("submit", function (event) {
    event.preventDefault()

    const selectedDegree = document.getElementById("degreeSelect").value
    const currentSalary = parseFloat(
      document.getElementById("currentSalary").value
    )
    let noticeMessage = ""

    // Find a matching entry from the salaryData
    const matchingData = salaryData.find(
      (item) =>
        item.degree === selectedDegree &&
        currentSalary >= item.salaryMin &&
        currentSalary <= item.salaryMax
    )

    // If a matching salary range was found
    if (matchingData) {
      let salaryEarn = matchingData.salaryEarn
      let newSalary = currentSalary + salaryEarn

      // If the calculated new salary exceeds the salary new limit, adjust the new salary and notice
      if (newSalary > matchingData.salaryNewLimit) {
        noticeMessage = `Notice: Your earned salary (${salaryEarn}) and current salary (${currentSalary}) exceed the new salary limit (${matchingData.salaryNewLimit}), so your new salary is adjusted to the limit.`
        newSalary = matchingData.salaryNewLimit
        salaryEarn = matchingData.salaryNewLimit - currentSalary
      }

      document.getElementById(
        "result"
      ).innerHTML = `Salary Earn: ${salaryEarn}, New Salary: ${newSalary} <br> ${noticeMessage}`
    } else {
      document.getElementById("result").innerHTML =
        "No matching data found for the selected degree and current salary. Please ensure your current salary falls within the available ranges."
    }
  })

document.getElementById("clearButton").addEventListener("click", function () {
  // Clear the form fields
  document.getElementById("degreeSelect").value = ""
  document.getElementById("currentSalary").value = ""

  // Optionally, if you have other fields like 'salaryLimit', clear them as well
  // document.getElementById('salaryLimit').value = '';

  // Clear the result display
  document.getElementById("result").innerHTML = ""

  // If there are any other elements you want to reset, you can do so here
})
