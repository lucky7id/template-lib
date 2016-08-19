const template = () => {
    return(
        `<div>
            <ul data-each='myList'>
                <li>{name}</li>
            </ul>
            <ul data-each='myList'>
                <li>{number}</li>
            </ul>
        </div>`
    )
}

const model = {
  myList: [
    { name: 'nic', number: 1},
    { name: 'jeremy', number: 10 }
  ]
}

// note this will only work when there is a single root element in the template
const stringToDom = (string) => {
    let dummyNode = document.createElement('div');

    dummyNode.innerHTML = template();

    return dummyNode.firstChild;
}

const replaceTextWithVar = (data, match) => {
    const prop = match.replace(/(\{|\})/g, '');
    return data[prop];
}

const expandDOMloops = (dom, data) => {
    // get all nodes, and cast the results to an array
    const nodes = [...dom.querySelectorAll('[data-each]')]
    const varRegex = /\{(.+)\}/g;

    nodes.forEach( node => {
        let newNode = document.createElement('ul');
        let children = [...node.childNodes];
        let list = data[node.getAttribute('data-each')];

        list.forEach(item => {
            children.forEach(child => {
                let text = child.textContent;

                if (!text) { return newNode.appendChild(child); }
                if (varRegex.test(text)) {
                    child.textContent = child.textContent.replace(
                        varRegex, replaceTextWithVar.bind(this, item));
                }
            })

            node.parent.replace(node, newNode)
        })
    })

    return dom;
}


function ViewModel(template, selector, json) {
    this._json = {} || json;
    this.template = template;
    this.root = selector;
}

ViewModel.prototype.set = function(key, val) {
    this._json[key] = val;
    this.render();
}

ViewModel.prototype.render = function() {

}

ViewModel.prototype._expandTemplate = function() {
    this._expandedTemplate = expandDOMloops(stringToDom(template()), model);
}

let view = new ViewModel(template(), 'body', model);

view.render();
