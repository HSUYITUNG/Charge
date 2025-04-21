const form = document.getElementById("recordForm");
const recordsContainer = document.getElementById("records");
const monthInput = document.getElementById("month"); // 新增：取得月份選擇器
let records = []; // 儲存所有紀錄
let totalAmount = 0; // 儲存總支出

// 🔥 新增：取得切換按鈕與報表容器
const showRecordsBtn = document.getElementById("show-records");
const showReportBtn = document.getElementById("show-report");
const reportContainer = document.getElementById("report");

// 當提交表單時新增一筆記帳紀錄
form.addEventListener("submit", function(event) {
    event.preventDefault(); // 防止表單自動提交刷新頁面

    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const note = document.getElementById("note").value;

    // 生成紀錄
    const record = {
        date,
        category,
        amount,
        note,
        month: date.substring(0, 7) // 提取年份-月份 (yyyy-mm)
    };

    // 儲存紀錄
    records.push(record);

    // 根據篩選的月份顯示紀錄
    displayRecords(monthInput.value);

    form.reset(); // 清空表單
});

// 根據選擇的月份篩選記錄並顯示
monthInput.addEventListener("change", function() {
    displayRecords(monthInput.value);
});

// 🔥 新增：按鈕切換事件
showRecordsBtn.addEventListener("click", function() {
    recordsContainer.style.display = "block";
    reportContainer.style.display = "none";
    displayRecords(monthInput.value);
});

showReportBtn.addEventListener("click", function() {
    recordsContainer.style.display = "none";
    reportContainer.style.display = "block";
    displayReport(monthInput.value);
});

// 顯示紀錄並計算總支出
function displayRecords(selectedMonth) {
    recordsContainer.innerHTML = ""; // 清空紀錄區域
    totalAmount = 0; // 重設總支出

    // 篩選出選定月份的紀錄
    const filteredRecords = records.filter(record => record.month === selectedMonth);

    // 顯示篩選出的紀錄
    filteredRecords.forEach(record => {
        const recordElement = document.createElement("div");
        recordElement.classList.add("record");

        recordElement.innerHTML = `
            <p><strong>日期：</strong>${record.date}</p>
            <p><strong>類別：</strong>${record.category}</p>
            <p><strong>金額：</strong>${record.amount}</p>
            <p><strong>備註：</strong>${record.note}</p>
            <button class="delete-btn">刪除</button>
        `;

        // 加入刪除按鈕功能
        recordElement.querySelector(".delete-btn").addEventListener("click", function() {
            const index = records.indexOf(record);
            if (index > -1) {
                records.splice(index, 1); // 從紀錄中刪除
                displayRecords(selectedMonth); // 重新顯示紀錄
            }
        });

        // 更新總支出
        totalAmount += record.amount;

        // 把新的記錄加到記錄區
        recordsContainer.appendChild(recordElement);
    });

    // 顯示該月總支出
    const totalAmountElement = document.getElementById("totalAmount");
    if (!totalAmountElement) {
        const totalAmountDisplay = document.createElement("div");
        totalAmountDisplay.id = "totalAmount";
        totalAmountDisplay.style.fontSize = "1.2rem";
        totalAmountDisplay.style.fontWeight = "bold";
        totalAmountDisplay.style.marginTop = "20px";
        totalAmountDisplay.innerHTML = `該月總支出：$${totalAmount.toFixed(2)}`;
        recordsContainer.appendChild(totalAmountDisplay);
    } else {
        totalAmountElement.innerHTML = `該月總支出：$${totalAmount.toFixed(2)}`;
    }
}

// 🔥 新增：產生支出報表
function displayReport(selectedMonth) {
    reportContainer.innerHTML = "";

    const filteredRecords = records.filter(record => record.month === selectedMonth);

    const categoryTotals = {};
    let overallTotal = 0;

    filteredRecords.forEach(record => {
        categoryTotals[record.category] = (categoryTotals[record.category] || 0) + record.amount;
        overallTotal += record.amount;
    });

    if (overallTotal === 0) {
        reportContainer.innerHTML = "<p>無資料</p>";
        return;
    }

    for (const category in categoryTotals) {
        const percent = ((categoryTotals[category] / overallTotal) * 100).toFixed(1);
        const bar = `<div class="report-bar" style="width:${percent}%;"></div>`;
        reportContainer.innerHTML += `
            <div style="margin-bottom:10px;">
                <strong>${category}：</strong> $${categoryTotals[category].toFixed(2)} (${percent}%)
                ${bar}
            </div>
        `;
    }
}