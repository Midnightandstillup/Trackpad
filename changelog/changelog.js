var changelogs = [
  // copy upwards
  {
    versionRef: "Version 0.1.1",
    changeList: `
      <li>Added new theme: Lavender</li>
      <li>Theme requests are now open!</li>
    `,
  },
];

const changelogList = document.getElementById("changelogList");

var changelogHTML = ``;

changelogs.forEach((changelog, index) => {
  if(index === 0) {
    changelogHTML += `
    <div class="changelogEntryDiv">
      <p class="changelog_version header_textColor">${changelog.versionRef} (Current version)</p>
      <ul class="changelog_list header_textColor">
        ${changelog.changeList}
      </ul>
      <hr class="popup_color"/>
    </div>
    `;
  } else {
    changelogHTML += `
      <div class="changelogEntryDiv">
        <p class="changelog_version header_textColor">${changelog.versionRef}</p>
        <ul class="changelog_list header_textColor">
          ${changelog.changeList}
        </ul>
        <hr class="popup_color"/>
      </div>
    `;
  }
});

changelogList.innerHTML = changelogHTML;