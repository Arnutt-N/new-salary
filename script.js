document.addEventListener("DOMContentLoaded", () => {
  const degreeSelect = document.getElementById("degreeSelect");

  // Add default option as the first item
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "เลือกวุฒิการศึกษาที่บรรจุ หรือวุฒิการศึกษาในตำแหน่งปัจจุบัน"; 
  defaultOption.disabled = true;
  defaultOption.selected = true;
  degreeSelect.appendChild(defaultOption);

  // Extract unique degrees from the salaryData and append as dropdown options
  const uniqueDegrees = [...new Set(salaryData.map((item) => item.degree))];
  uniqueDegrees.forEach((degree) => {
    const option = document.createElement("option");
    option.value = degree;
    option.textContent = degree;
    degreeSelect.appendChild(option);
  });

  // Initialize Select2 on the degreeSelect element after options are appended
  $(degreeSelect).select2({
    placeholder: "เลือกวุฒิการศึกษาที่บรรจุ",
    allowClear: true,
    dropdownCssClass: "wrap-text",
    templateResult: function (data) {
      var $option = $('<span style="white-space: normal;">' + data.text + '</span>');
      return $option;
    },
  });
});

document.getElementById("salaryCalcForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const selectedDegree = document.getElementById("degreeSelect").value;
  const currentSalary = parseFloat(document.getElementById("currentSalary").value);
  let noticeMessage = "";

  // Find a matching entry from the salaryData
  const matchingData = salaryData.find(
    (item) =>
      item.degree === selectedDegree &&
      currentSalary >= item.salaryMin &&
      currentSalary <= item.salaryMax
  );

  // If a matching salary range was found
  if (matchingData) {
    let salaryEarn = matchingData.salaryEarn;
    let newSalary = currentSalary + salaryEarn;

    // If the calculated new salary exceeds the salary new limit, adjust the new salary and notice
    if (newSalary > matchingData.salaryNewLimit) {
      noticeMessage = `<div style="line-height: 1.6;margin-top:20px">หมายเหตุ : คำนวณจำนวนเงินที่ได้ปรับ ${salaryEarn.toLocaleString()} บาท เมื่อรวมกับอัตราเงินเดือน ${currentSalary.toLocaleString()} บาท แล้ว อัตราเงินเดือนที่ได้รับจะต้องไม่เกิน ${matchingData.salaryNewLimit.toLocaleString()} บาท</div>`;
      newSalary = matchingData.salaryNewLimit;
      salaryEarn = matchingData.salaryNewLimit - currentSalary;
    }

    document.getElementById("result").innerHTML = `
    <div style="line-height: 2;">
        👩‍💻 <strong>จำนวนเงินที่ได้ปรับ : ${salaryEarn.toLocaleString()} บาท</strong>
        <br>👨‍💻 <strong>อัตราเงินเดือนที่ได้รับ : ${newSalary.toLocaleString()} บาท</strong>
        <br> ${noticeMessage}
    </div>`;
  } else {
    document.getElementById("result").innerHTML =
      `<div style="line-height: 1.2;"><p>ไม่พบข้อมูลการปรับอัตราเงินเดือนที่สอดคล้องกับวุฒิการศึกษาและอัตราเงินเดือนตามที่ท่านระบุ กรุณาตรวจสอบข้อมูลวุฒิการศึกษาและอัตราเงินเดือนปัจจุบันของท่านอีกครั้ง </p><p>หากมีข้อสงสัยหรือต้องการข้อมูลเพิ่มเติม สามารถติดต่อสอบถามได้ที่หมายเลขโทรศัพท์ 0 2141 5192</p></div>`;
  }
});

document.getElementById("clearButton").addEventListener("click", function () {
  // Clear the current salary input field
  document.getElementById("currentSalary").value = "";

  // Clear the Select2 dropdown and reset to the placeholder
  $("#degreeSelect").val(null).trigger("change"); // Resetting Select2 dropdown

  // Clear the result display
  document.getElementById("result").innerHTML = "";
});
