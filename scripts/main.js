const todoSection = document.getElementById("todoSection");
const completedSection = document.getElementById("completedSection");
const deletedSection = document.getElementById("deletedSection");

var trackpadGlobal;

var loadedItems = [];
var loadedSettings = {};


if(!localStorage.getItem("trackpadGlobal")) {
  trackpadGlobal = {
    items: [],
    theme: ["solid", "white"],
    settings: {
      keepDeletedItems: false,
    }
  };
  localStorage.setItem("trackpadGlobal", JSON.stringify(trackpadGlobal));

  loadedItems = trackpadGlobal.items;
  loadedSettings = trackpadGlobal.settings;

} else {
  try {
    loadedItems = JSON.parse(localStorage.getItem("trackpadGlobal")).items;
    loadedSettings = JSON.parse(localStorage.getItem("trackpadGlobal")).settings;
  } catch {
    trackpadGlobal = {
      items: [],
      theme: ["solid", "white"],
      settings: {
        keepDeletedItems: false,
      }
    };
    localStorage.setItem("trackpadGlobal", JSON.stringify(trackpadGlobal));
  
    loadedItems = trackpadGlobal.items;
    loadedSettings = trackpadGlobal.settings;
  
  }
}



var reloadWithSave = true;










var themeList = {
  solid: [
    {
      themeID: "white",
      themeTitle: "White",
      themeType: "light",
      themeCategory: "solid",
      preview: [
        "rgb(245, 240, 240)",
        "rgb(225, 220, 220)",
        "rgb(205 , 200, 200)",
        "rgb(50, 50, 55)",
      ],
    },
    {
      themeID: "black",
      themeTitle: "Black",
      themeType: "dark",
      themeCategory: "solid",
      preview: [
        "rgb(20, 20, 25)",
        "rgb(30, 30, 35)",
        "rgb(40 , 40, 45)",
        "rgb(210, 210, 215)",
      ],
    },
    {
      themeID: "tannedPaper",
      themeTitle: "Tanned Paper",
      themeType: "light",
      themeCategory: "solid",
      preview: [
        "rgb(226, 218, 207)",
        "rgb(216, 208, 197)",
        "rgb(206, 198, 187)",
        "rgb(50, 45, 40)",
      ],
    },
    {
      themeID: "dreams",
      themeTitle: "Dreams",
      themeType: "light",
      themeCategory: "solid",
      preview: [
        "rgb(238, 165, 166)",
        "rgb(228, 147, 179)",
        "rgb(183, 132, 183)",
        "rgb(50, 45, 45)",
      ],
    },
  ],
};

var currentActiveTheme;
var currentActiveThemeType;

function getThemeByID(themeArray, ID) {
  try {
    return themeArray.find(theme => theme.themeID === ID);
  } catch {
    return false;
  }
}

var fallbackTheme = getThemeByID(themeList.solid, "white");
var loadedLastTheme;
try {
  loadedLastTheme = getThemeByID(themeList[JSON.parse(localStorage.getItem("trackpadGlobal")).theme[0]], JSON.parse(localStorage.getItem("trackpadGlobal")).theme[1]);
} catch {
  loadedLastTheme = false;
}


if(loadedLastTheme) {
  document.body.classList.add(`${loadedLastTheme.themeID}_theme`);
  changeIconButtonColor(loadedLastTheme.themeType);

  currentActiveTheme = loadedLastTheme.themeID;
  currentActiveThemeType = loadedLastTheme.themeType;
  currentActiveThemeCategory = loadedLastTheme.themeCategory

  // sessionStorage.setItem("lastUsedTheme", JSON.stringify([loadedLastTheme.themeCategory, loadedLastTheme.themeID]));
} else {
  setTimeout(() => {
    // UI.error("Something went wrong finding that theme. Defaulting to fallback theme.");
  }, 500);

  currentActiveTheme = "white";
  currentActiveThemeType = "light";


  document.body.classList.add("white_theme");
  changeIconButtonColor(currentActiveThemeType);


}


function changeTheme(newTheme, themeType, themeCategory) {
  let currentTheme = [...document.body.classList].find(clss => clss.includes('_theme'));
  document.body.classList.replace(currentTheme, newTheme + "_theme")
  document.querySelectorAll(".themeMenu_themeSection_themeButton").forEach(element => {
    if(element.classList.contains("selectedMenuButton")) {
      element.classList.remove("selectedMenuButton");
    }
  });

  currentActiveThemeType = themeType;

  document.getElementById(newTheme + "_themeButton").classList.add("selectedMenuButton");
  let trackpadGlobal_setNewTheme = JSON.parse(localStorage.getItem("trackpadGlobal"));
  trackpadGlobal_setNewTheme.theme = ["solid", newTheme];
  localStorage.setItem("trackpadGlobal", JSON.stringify(trackpadGlobal_setNewTheme));
  


  changeIconButtonColor(themeType);
}

function changeIconButtonColor(themeType) {
  document.querySelectorAll(".icon").forEach(icon => {
    let currentSRC = icon.src;
    if(themeType === "dark") {
      icon.src = currentSRC.replace("light", "dark");
      icon.classList.replace("iconButton_light", "iconButton_dark");
      } else if(themeType === "light") {
        icon.src = currentSRC.replace("dark", "light");
        icon.classList.replace("iconButton_dark", "iconButton_light");
    }
  });
}

var themeMenuElement = document.createElement("div");
themeMenuElement.id = "themeMenu";
themeMenuElement.classList.add("menu_color");

const themeMenuButton = document.getElementById("themeMenuButton");

function closeOpenThemeMenu(event) {
  if(document.getElementById("themeMenu") && (event.target.id !== "themeMenu" && event.target.id !== "themeMenuButton" && !event.target.classList.contains("menuSubElement"))) {
    document.getElementById("themeMenu").remove();
    document.removeEventListener("click", closeOpenThemeMenu);
  }
}

function generatePreview(previewArray) {
  let previewContent = "";
  if(previewArray.length === 0) {
    return "<p class='preview_noPreview'>No Preview</p>";
  } else {
    previewArray.forEach(color => {
      previewContent += `
      <div class="previewBar" style="background-color: ${color};"></div>
      `;
    })
    return previewContent;
  }
}

function loadThemeButtons(themeTreeRef) {
  let outputButtonListHTML = "";
  themeList[themeTreeRef].forEach(theme => {
    if(currentActiveTheme === theme.themeID) {
      outputButtonListHTML += `
        <div onclick="changeTheme('${theme.themeID}', '${theme.themeType}', '${theme.themeCategory}')" id="${theme.themeID}_themeButton" class="themeMenu_themeSection_themeButton selectedMenuButton menuSubElement themeMenu_themeSection_themeButton_color">
          <div class="previewContainer popup_color clickThrough">${generatePreview(theme.preview)}</div>
          <p class="themeMenu_themeSection_themeButton_themeTitle clickThrough">${theme.themeTitle}</p>
        </div>
      `;
    } else {
      outputButtonListHTML += `
        <div onclick="changeTheme('${theme.themeID}', '${theme.themeType}', '${theme.themeCategory}')" id="${theme.themeID}_themeButton" class="themeMenu_themeSection_themeButton menuSubElement themeMenu_themeSection_themeButton_color">
          <div class="previewContainer popup_color clickThrough">${generatePreview(theme.preview)}</div>
          <p class="themeMenu_themeSection_themeButton_themeTitle clickThrough">${theme.themeTitle}</p>
        </div>
      `;
    }
  });
  return outputButtonListHTML;
}

themeMenuButton.addEventListener("click", function openTheThemeMenu(event) {
  if(document.getElementById("themeMenu")) return;

  themeMenuElement.innerHTML = `
    <div id="themeMenu_themeSection" class="themeMenu_themeSection_color"></div>
  `;
  document.body.appendChild(themeMenuElement);
  setTimeout(() => {
    try {
      document.getElementById("themeMenu").querySelectorAll('*').forEach(element => {element.classList.add("menuSubElement")})

      themeMenu_themeSection.innerHTML = loadThemeButtons("solid");
  
    } catch {
      // UI.warn("Unable to attach themeMenu to themeMenu container. You clicked out of the menu too fast.")
    }
  }, 100);

  document.addEventListener("click", closeOpenThemeMenu, true);
  event.stopPropagation();
});



var uid = 0;
function generateUID(increment) {
  if(!increment) return uid;
  uid++;
  return Number(uid);
}

loadedItems.forEach((item) => {
  let deletedStatus = function() {
    if(item.deleted) {
      return "deleted";
    } else if(!item.deleted) {
      return "notDeleted";
    }
  }
  let itemHTML = `
    <div class="itemContainer item${generateUID(true)}">
      <div class="item_statusBox itemStatus itemStatusColor" onclick="handleStatusChange(${generateUID()})">
        <div class="item_statusBox_status status_${item.status} ${deletedStatus()}"></div>
      </div>
      <input class="item_title textColor" value="${item.content}" placeholder="Add content"/>
      <img class="threeDotMenuIcon icon" onclick="openContextMenu(${generateUID()}, event)" src="assets/threeDots_${currentActiveThemeType}.png"/>
    </div>
  `;
  if(item.deleted) {
    deletedSection.insertAdjacentHTML("beforeend", itemHTML);
    updateTitleCounter();
  } else if(item.status === "done") {
    completedSection.insertAdjacentHTML("beforeend", itemHTML);
    updateTitleCounter();
  } else {
    todoSection.insertAdjacentHTML("beforeend", itemHTML);
    updateTitleCounter();
  }
});


function openContextMenu(uidREF, event) {

  if(document.getElementById("threeDotContextMenu")) return;
  let elementToOpenMenu = document.getElementsByClassName("item" + uidREF)[0];
  let oldStatus = elementToOpenMenu.querySelector(".item_statusBox_status").classList;

  var threeDotContextMenu = document.createElement("div");
  threeDotContextMenu.id = "threeDotContextMenu";
  threeDotContextMenu.classList.add("contextMenu_color");
  console.log("context meun: " + uidREF);

  if(oldStatus.contains("deleted")) {
    threeDotContextMenu.innerHTML = `
      <p class="threeDotContextMenu_button contextMenu_buttons_color" onclick="handleDeleteStatusChange(${uidREF}, 'restore')">Restore</p>
  `;
  } else {
    threeDotContextMenu.innerHTML = `
      <p class="threeDotContextMenu_button contextMenu_buttons_color" onclick="handleDeleteStatusChange(${uidREF}, 'delete')">Delete</p>
    `;
  }
  document.body.appendChild(threeDotContextMenu);
  threeDotContextMenu.style.left = `${event.pageX - document.getElementById("threeDotContextMenu").offsetWidth}px`;
  threeDotContextMenu.style.top = `${event.pageY}px`;

  setTimeout(() => {
    document.addEventListener("click", function removeContextMenu(event) {
      if (event.target.id !== "threeDotContextMenu") {
        document.removeEventListener("click", removeContextMenu);
        document.getElementById("threeDotContextMenu").remove();
      }
    });
  }, 250);
  
}

function updateTitleCounter() {
  ["todoSection", "completedSection", "deletedSection"].forEach(sectionREF => {
    let titleElement = document.getElementById(sectionREF + "_title");
    let counterNumber = document.getElementById(sectionREF).children.length;
    console.log("sectionREF: " + sectionREF)
    let titleText = titleElement.innerText;
  
    titleText = titleText.replace(/\(\d+\)$/, '');
    titleElement.innerText = titleText + " (" + counterNumber + ")";
  });
}

function handleStatusChange(uidREF) {
  let elementToMove = document.getElementsByClassName("item" + uidREF)[0];

  let oldStatus = elementToMove.querySelector(".item_statusBox_status").classList;
  console.log(oldStatus);
  if(!oldStatus.contains("deleted")) {
    if(oldStatus.contains("status_not_done")) {
  
      elementToMove.querySelector(".item_statusBox_status").classList.replace("status_not_done", "status_done");
      let extractedItem = elementToMove.cloneNode(true);
  
      elementToMove.remove();
      completedSection.appendChild(extractedItem);
      updateTitleCounter();
    } else {
      elementToMove.querySelector(".item_statusBox_status").classList.replace("status_done", "status_not_done");
      let extractedItem = elementToMove.cloneNode(true);
  
      elementToMove.remove();
      todoSection.appendChild(extractedItem);
      updateTitleCounter();
    }
  } else {
    if(oldStatus.contains("status_not_done")) {
      elementToMove.querySelector(".item_statusBox_status").classList.replace("status_not_done", "status_done");
    } else {
      elementToMove.querySelector(".item_statusBox_status").classList.replace("status_done", "status_not_done");
    }
  }
}


function handleDeleteStatusChange(uidREF, action) {
  let elementToMove = document.getElementsByClassName("item" + uidREF)[0];

  let oldStatus = elementToMove.querySelector(".item_statusBox_status").classList;
  console.log(oldStatus)

  if(action === "delete") {
    elementToMove.querySelector(".item_statusBox_status").classList.replace("notDeleted", "deleted");
    let extractedItem = elementToMove.cloneNode(true);
    elementToMove.remove();
    deletedSection.appendChild(extractedItem);
    updateTitleCounter();
  } else if(action === "restore") {
    if(oldStatus.contains("status_not_done")) {
      elementToMove.querySelector(".item_statusBox_status").classList.replace("status_not_done", "status_done");
    } else {
      elementToMove.querySelector(".item_statusBox_status").classList.replace("status_done", "status_not_done");
    }
    elementToMove.querySelector(".item_statusBox_status").classList.replace("deleted", "notDeleted");
   
    handleStatusChange(uidREF);
  }
}


document.getElementById("addNewItemButton").onclick = function() {
  todoSection.insertAdjacentHTML("beforeend", `
    <div class="itemContainer item${generateUID(true)}">
      <div class="item_statusBox itemStatus itemStatusColor" onclick="handleStatusChange(${generateUID()})">
        <div class="item_statusBox_status status_not_done notDeleted"></div>
      </div>
      <input class="item_title textColor" value="" placeholder="Add content"/>
      <img class="threeDotMenuIcon icon" onclick="openContextMenu(${generateUID()}, event)" src="assets/threeDots_${currentActiveThemeType}.png"/>
    </div>
  `);
  updateTitleCounter();

  document.querySelector(`.item${generateUID()} .item_title`).focus();
};


function saveAll() {

  let status = function(child) {
    let status = child.querySelector(".item_statusBox_status").classList[1].substring(7);
    if(status !== undefined) {
      console.log(status)
      return status;
    } else {
      return "not_done"
    }
  }

  let content = function(child) {
    return child.querySelector(".item_title").value;
  };

  let deleted = function(child) {
    let deleted = child.querySelector(".item_statusBox_status").classList[2];
    if(deleted !== undefined) {
      if(deleted === "deleted") {
        return true;
      } else if(deleted === "notDeleted") {
        return false;
      }
    }
  }

  let saveArray = [];

  Array.from(todoSection.children).forEach((child) => {
    let item = {
      status: status(child),
      content: content(child),
      deleted: deleted(child),
    }
    if(item.content !== "") {
      saveArray.push(item);
    }
  });
  Array.from(completedSection.children).forEach((child) => {
    let item = {
      status: status(child),
      content: content(child),
      deleted: deleted(child),
    }
    if(item.content !== "") {
      saveArray.push(item);
    }
  });
  if( loadedSettings.keepDeletedItems) {
    Array.from(deletedSection.children).forEach((child) => {
      let item = {
        status: status(child),
        content: content(child),
        deleted: deleted(child),
      }
      if(item.content !== "") {
        saveArray.push(item);
      }
    });
  }
  console.log(saveArray)
  let trackpadGlobal_setSaveItems = JSON.parse(localStorage.getItem("trackpadGlobal"));
  trackpadGlobal_setSaveItems.items = saveArray;
  localStorage.setItem("trackpadGlobal", JSON.stringify(trackpadGlobal_setSaveItems));
}

setInterval(() => {
  saveAll();
}, 30000);

window.addEventListener("beforeunload", function() {
  if(!reloadWithSave) return;
  saveAll();
});




const settingsButton = document.getElementById("settingsButton");

settingsButton.onclick = function() {

  function get_keepDeletedItems() {
    switch(loadedSettings.keepDeletedItems) {
      case true:
        return `
          <option selected value="true">True</option>
          <option value="false">False</option>
        `;
      case false:
        return `
          <option value="true">True</option>
          <option selected value="false">False</option>
        `;
    }
  }

  var background_settingsMenu = document.createElement("div");
  background_settingsMenu.id = "background_settingsMenu";

  var settingsMenu = document.createElement("div");
  settingsMenu.id = "settingsMenu";
  settingsMenu.classList.add("popup_color", "textColor");
  settingsMenu.innerHTML = `
    <p class="settingsMenu_title">Settings</p>
    <hr class="settingsMenu_hr"/>
    <div class="settingsMenu_inputWrapper">
      <label for="keepDeletedItems_setting" title="Any items left in the deleted section when you leave will be deleted if set to True.">Keep deleted items:</label> 
      <select id="keepDeletedItems_setting" class="settingsInput selectColor">
        ${get_keepDeletedItems()}
      </select>
    </div>
    <hr class="settingsMenu_hr" style="margin-top: 5%;"/>
    <p class="settingsMenu_subTitle">Import / Export</p>
    <div class="settingsMenu_inputWrapper">
      <div id="exportButton" class="exportImportButtonColor" title="Export your current items and settings"><p>Export</p></div>
      <div id="importButton" class="exportImportButtonColor" title="Import a '.trackpaddata' file. WARNING: This will delete all your current data"><p>Import</p></div>
      <input type="file" id="importButton_fileInput" style="display: none;"/>
    </div>
    <p id="versionNumber"></p>
  `;

  background_settingsMenu.appendChild(settingsMenu);
  document.body.appendChild(background_settingsMenu);

  setTimeout(() => {
    
    document.getElementById("versionNumber").innerText = "Version: " + currentVersionNumber;

    document.addEventListener("click", function closeTheSettingsMenu(event) {
      console.log(event.target.id)
      if(event.target.id === "background_settingsMenu") {
        document.removeEventListener("click", closeTheSettingsMenu);
        document.getElementById("background_settingsMenu").remove();
      }
    });

    document.getElementById("keepDeletedItems_setting").oninput = function() {
      let newValue;
      if(document.getElementById("keepDeletedItems_setting").value === "true") {
        newValue = true;
      } else {
        newValue = false;
      }
      let trackpadGlobal_setNewSetting = JSON.parse(localStorage.getItem("trackpadGlobal"));
      trackpadGlobal_setNewSetting.settings.keepDeletedItems = newValue;
      localStorage.setItem("trackpadGlobal", JSON.stringify(trackpadGlobal_setNewSetting));
      loadedSettings.keepDeletedItems = newValue;
    }

    document.getElementById("exportButton").onclick = function() {
      saveAll();
      setTimeout(() => {
        let content = localStorage.getItem("trackpadGlobal");
        downloadTextFile(content, "export");
      }, 100);
    };


    document.getElementById("importButton").onclick = function() {
      document.getElementById("importButton_fileInput").click();
    };

    document.getElementById("importButton_fileInput").onchange = async function(event) {
      let importedFile = event.target.files[0];
      if (importedFile) {
        let fileExtension = importedFile.name.split('.').pop().toLowerCase();
        if(fileExtension !== "trackpaddata") {
            alert("Invalid file type. Only '.trackpaddata' is allowed.");
            return;
        }
        await new Promise((resolve, reject) => {
          var reader = new FileReader();
          reader.onload = function(event) {
              let importData = JSON.parse(event.target.result);
              localStorage.setItem("trackpadGlobal", JSON.stringify(importData));
              setTimeout(() => {
                reloadWithSave = false;
                window.location.reload();
              }, 250);
            resolve();
          };
          reader.onerror = function(error) {
              alert("An error occurred while reading the file", error);
              reject();
          };
          reader.readAsText(importedFile);
        });
      }
    };

  }, 100);
};





function downloadTextFile(fileContent, fileTitle) {
  let newBlob = new Blob([fileContent], { type: 'text/plain' });
  let url = URL.createObjectURL(newBlob);
  let download = document.createElement('a');

  download.href = url;
  download.download = fileTitle + ".trackpaddata";
  document.body.appendChild(download);
  download.click();
  document.body.removeChild(download);
  URL.revokeObjectURL(url);
}