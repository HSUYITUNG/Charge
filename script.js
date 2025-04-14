const apiUrl = "https://script.google.com/macros/s/AKfycbydnjy0bokSQWxEAnZNYYktp6QT4Q_P_gprC209WMt9K4DqfmaP7CWkAI8vWZ2rVRca/exec"; // 這裡替換為你從 Google Apps Script 中獲得的 URL

const form = document.getElementById("recordForm");
const recordsContainer = document.getElementById("records");

// 讀取 Google Sheets 的記帳紀錄並顯示
async function loadRecords() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        recordsContainer.innerHTML = "";

        for (let i = 1; i < data.length; i++) { // i 從 1 開始，因為第一行是標題
            const [date, category, amount, note] = data[i];
            const rowIndex = i + 1; // Google Sheets 實際列數

            const recordElement = document.createElement("div");
            recordElement.classList.add("record");
            recordElement.innerHTML = `
                <p><strong>日期：</strong>${date}</p>
                <p><strong>類別：</strong>${category}</p>
                <p><strong>金額：</strong>${amount}</p>
                <p><strong>備註：</strong>${note}</p>
                <button class="delete-btn" data-row="${rowIndex}">刪除</button>
            `;
            recordsContainer.appendChild(recordElement);
        }

        // 為每個刪除按鈕加上事件監聽
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(button => {
            button.addEventListener("click", async (e) => {
                const row = e.target.getAttribute("data-row");
                const confirmDelete = confirm("確定要刪除這筆資料嗎？");

                if (confirmDelete) {
                    await fetch(apiUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "delete", row })
                    });

                    alert("刪除成功！");
                    loadRecords(); // 重新載入資料
                }
            });
        });

    } catch (error) {
        console.error("讀取紀錄時發生錯誤：", error);
    }
}

// 新增記帳資料
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const amount = Number(document.getElementById("amount").value);
    const note = document.getElementById("note").value;

    const newRecord = { date, category, amount, note };

    await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(newRecord),
        headers: { "Content-Type": "application/json" }
    });    

    form.reset();
    alert("記帳成功！（請到 Google Sheets 查看資料）");

    // **重新載入紀錄，確保新資料即時顯示**
    setTimeout(loadRecords, 2000); // 等 2 秒後重新載入資料
});

// **網頁載入時自動載入記帳紀錄**
window.addEventListener("load", loadRecords);
