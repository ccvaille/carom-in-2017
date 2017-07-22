const getCsListHTML = (csList) => {
    let html = '';
    csList.forEach((group) => {
        let listHTML = '';
        group.data.forEach((cs) => {
            listHTML += `
                <li class="ec--cs">
                    <a class="ec--cs-item" data-csid="${cs.csid}">${cs.showname}</a>
                </li>
            `;
        });
        html += `
            <li class="ec--cs-group">
                <a class="ec--cs-group-name" href="javascript:;" data-id="${group.id}">${group.name}</a>
                <ul class="ec--cs-group-list">${listHTML}</ul>
            </li>
        `;
    });
    return html;
};

export default (data) => {
    const { listset, theme, bmodestyle, cslist } = data;
    const list = `
        <div class="ec--cs-list ${theme}">
            <div class="title">
                在线咨询
                <a class="close" href="javascript:;">×</a>
            </div>
            <ul class="list">${getCsListHTML(cslist)}</ul>
        </div>
    `;
    const rand = `<div class="ec--cs-btn ${bmodestyle}"></div>`;

    if (listset.showstyle === 0) {
        return list;
    }
    if (listset.showstyle === 1) {
        return rand;
    }
};
