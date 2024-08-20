document.addEventListener("DOMContentLoaded", () => {
  const degreeSelect = document.getElementById("degreeSelect")

  // Add default option as the first item
  const defaultOption = document.createElement("option")
  defaultOption.value = ""
  defaultOption.textContent = "เลือกวุฒิการศึกษาที่บรรจุ หรือวุฒิการศึกษาในตำแหน่งปัจจุบัน" // "Select Degree"
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

  // Initialize Select2 on your degreeSelect element after options are appended
  // $(degreeSelect).select2({
  //   placeholder: "เลือกวุฒิการศึกษาที่บรรจุ", // "Select Degree"
  //   allowClear: true,
  //   dropdownCssClass: "wrap-text", // Apply custom dropdown styling
  // })

  $(degreeSelect).select2({
    // ... other options
    templateResult: function (data) {
      var $option = $(
        '<option style="white-space: normal;">' + data.text + "</option>"
      )
      return $option
    },
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
        noticeMessage = `หมายเหตุ: จำนวนเงินที่ได้ปรับ ${salaryEarn} บาท เมื่อรวมกับอัตราเงินเดือน ${currentSalary} บาท แล้ว อัตราเงินเดือนที่ได้รับจะต้องไม่เกิน ${matchingData.salaryNewLimit} บาท`
        newSalary = matchingData.salaryNewLimit
        salaryEarn = matchingData.salaryNewLimit - currentSalary
      }

      document.getElementById(
        "result"
      ).innerHTML = `จำนวนเงินที่ได้ปรับ: ${salaryEarn} บาท, อัตราเงินเดือนที่ได้รับ: ${newSalary} บาท<br> ${noticeMessage}`
    } else {
      document.getElementById("result").innerHTML =
        "ไม่พบข้อมูลการปรับอัตราเงินเดือนที่สอดคล้องกับวุฒิการศึกษาและอัตราเงินเดือนตามที่ท่านระบุ กรุณาตรวจสอบข้อมูลวุฒิการศึกษาและอัตราเงินเดือนปัจจุบันของท่านอีกครั้ง หากมีข้อสงสัยหรือต้องการข้อมูลเพิ่มเติม สามารถติดต่อสอบถามได้ที่หมายเลขโทรศัพท์ 0 2141 5192"
    }
  })

// document.getElementById("clearButton").addEventListener("click", function () {
//   // Clear the form fields
//   document.getElementById("degreeSelect").value = ""
//   document.getElementById("currentSalary").value = ""

//   // Optionally, if you have other fields like 'salaryLimit', clear them as well
//   // document.getElementById('salaryLimit').value = '';

//   // Clear the result display
//   document.getElementById("result").innerHTML = ""

//   // If there are any other elements you want to reset, you can do so here
// })

document.getElementById("clearButton").addEventListener("click", function () {
  // Clear the current salary input field
  document.getElementById("currentSalary").value = ""

  // Clear the Select2 dropdown and reset to the placeholder
  $("#degreeSelect").val(null).trigger("change") // Resetting Select2 dropdown

  // Optionally, clear other fields like 'salaryLimit'
  // document.getElementById('salaryLimit').value = '';

  // Clear the result display
  document.getElementById("result").innerHTML = ""
})
