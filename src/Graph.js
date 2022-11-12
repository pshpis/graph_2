import React, { Component } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
// import request from "cytoscape/dist/cytoscape.esm";

const iconImage = {
    object:"https://upload.wikimedia.org/wikipedia/commons/7/7e/Circle-icons-profile.svg",
    car:"https://img.icons8.com/metro/40/000000/car.png",
    house:"https://img.icons8.com/ios/40/000000/city-block.png",
    telephone:"https://img.icons8.com/ios-glyphs/40/000000/ringer-volume.png",
    social:"https://img.icons8.com/wired/40/000000/domain.png",
    meet:"https://img.icons8.com/ios/40/000000/restaurant-table.png",
    company:"https://img.icons8.com/ios/35/000000/permanent-job.png",
}

const stylesheet = [
    {
        selector: 'node',
        style: {
            height: 80,
            width: 80,
            backgroundColor: 'gray',
        }
    },
    {
        selector: 'edge',
        style: {
            width: 6
        }
    },
    {
        selector: `edge[relationType = "weak"]`,
        style: {
            lineColor: '#008000',
            label: "Зеленый"
        }
    },
    {
        selector: `edge[relationType = "medium"]`,
        style: {
            lineColor: '#FFA500',
            label: "Оранжевый"
        }
    },
    {
        selector: `edge[relationType = "strong"]`,
        style: {
            lineColor: '#FF0000',
            label: "Красный"
        }
    }
]

class CytoscapeDomNode {
    constructor(cy, params = {}) {
        this._cy = cy;
        this._params = params;
        this._node_dom = {};
        let cy_container = cy.container();

        if (params.dom_container) {
            this._nodes_dom_container = params.dom_container;
        } else {
            let nodes_dom_container = document.createElement("div");
            nodes_dom_container.style.position = 'absolute';
            nodes_dom_container.style.zIndex = 10;

            let cy_canvas = cy_container.querySelector("canvas");
            cy_canvas.parentNode.appendChild(nodes_dom_container);

            this._nodes_dom_container = nodes_dom_container;
        }

        this._resize_observer = new ResizeObserver((entries) => {
            for (let e of entries) {
                let node_div = e.target;
                let id = node_div.__cy_id;
                let n = cy.getElementById(id);
                n.style({
                    'width': node_div.offsetWidth,
                    'height': node_div.offsetHeight
                });
            }
        });

        cy.on('add', 'node', (ev) => {
            this._add_node(ev.target);
        });

        for (let n of cy.nodes())
            this._add_node(n);

        cy.on("pan zoom", (ev) => {
            let pan = cy.pan();
            let zoom = cy.zoom();

            let transform = "translate(" + pan.x + "px," + pan.y + "px) scale(" + zoom + ")";
            this._nodes_dom_container.style.msTransform = transform;
            this._nodes_dom_container.style.transform = transform;
        });

        cy.on('position bounds', 'node', (ev) => {
            let cy_node = ev.target;
            let id = cy_node.id();

            if (!this._node_dom[id])
                return;

            let dom = this._node_dom[id];

            let style_transform = `translate(-50%, -50%) translate(${cy_node.position('x').toFixed(2)}px, ${cy_node.position('y').toFixed(2)}px)`;
            dom.style.webkitTransform = style_transform;
            dom.style.msTransform = style_transform;
            dom.style.transform = style_transform;

            dom.style.display = 'inline';
            dom.style.position = 'absolute';
            dom.style['z-index'] = 10;
        });
    }

    _add_node(n) {
        let data = n.data();

        if (!data.dom)
            return;

        this._nodes_dom_container.appendChild(data.dom);
        data.dom.__cy_id = n.id();

        this._node_dom[n.id()] = data.dom;

        this._resize_observer.observe(data.dom);
    }

    node_dom(id) {
        return this._node_dom[id];
    }
}

export default class Graph extends Component {

    request = []
    edges = [];

    state = {
        elements: {},
        request: [],
        edges: [],
    }

    constructor(props) {
        super(props);
        console.log(props.request1);
        this.request = JSON.parse(JSON.stringify(props.request1));
        console.log(this.request);

        this.request.forEach(obj => {
            if (obj.targets !== []) {
                obj.targets.forEach(target => {
                    this.edges.push({
                        data: {
                            source: `${obj.data.id}`,
                            target: `${target.id}`,
                            relationType: `${target.relationType}`,
                            label: `${target.label}`
                        }
                    })
                })
            }
        });

        console.log(this.request);
    }

    componentDidMount = () => {
        console.log(this.request);

        function register(cy) {
            if (!cy)
                return;

            cy('core', 'domNode', function(params, opts) {
                return new CytoscapeDomNode(this, params, opts);
            });
        }

        const elements = {}
        elements.nodes = this.request.map(_ => ({
            data: {
                id: _.data.id,
                ..._.data
            }
        }));
        this.edges = [];
        this.request.forEach(obj => {
            obj.targets.forEach(target => {
                this.edges.push({
                    data: {
                        source: `cardItem${obj.data.id}`,
                        target: `cardItem${target.id}`,
                        relationType: target.relationType,
                        isBidirectional: target.isBidirectional,
                        label:target.label
                    }
                })
            })
        })
        elements.edges = JSON.parse(JSON.stringify(this.edges));
        console.log(elements);
        // this.cy.domNode();




        const layout = this.layout;
        const cardItem = this.cardItem;

        this.cy.nodes().remove();
        // this.cy.edges().remove();
        // this.cy.elements.remove();
        const cy = this.cy;
        this.request.forEach(function(obj) {
            try {
                cy.add(cardItem(obj.data));
            } catch (e){
                console.log("beeee");
                console.log(e);
            }
            layout();
        })
        elements.edges.forEach((edge) => {
            const obj = {
                group: 'edges',
                ...edge
            }
            try {
                cy.add(obj);
            }
            catch (e) {
                console.log("MEeEeee");
                console.log(e);
            }

        });

        this.setUpListeners();
        this.setUpListeners2();

        const RelationTypesColorEnum = {
            STRONG: '#dd1513', //amarillo o rojo
            MEDIUM: '#dbb135', //negro
            WEAK: '#1b669b', //grisaseo
        };
        Object.freeze(RelationTypesColorEnum);
    }

    cardInfo = ({ cardInfoId, label, rp, detail}) => {
        const id = cardInfoId || `cardInfo${this.cy.nodes().length}`;
        const cardInfo = document.createElement("div");
        cardInfo.setAttribute("id", id);
        cardInfo.className = "draggable";
        cardInfo.style = "background-color: white;box-shadow: -10px 10px 8px 0 rgba(0,0,0,0.2); width: 300px;";

        const cardInfoImage = document.createElement("div");
        cardInfoImage.style = "width: 200px;height: 30px;position: relative;overflow: hidden;border-radius: 50%;margin: 0 auto;";
        cardInfo.appendChild(cardInfoImage)

        const image = document.createElement("img")
        // image.src = "https://www.peoples.ru/character/literature/ostap_bender/bender_1.jpg" || detail.img
        cardInfoImage.appendChild(image)

        const title = document.createElement("h3")
        title.style = "text-transform: capitalize; font-weight: 700; padding-left: 30px;"
        title.innerHTML = detail.title
        cardInfo.appendChild(title)

        const charsDiv = document.createElement("div")
        charsDiv.style = "padding: 2px 30px"
        cardInfo.appendChild(charsDiv)

        Object.entries(detail.characteristics).forEach(attr => {
            const lineChar = document.createElement("p")
            lineChar.style = "margin-top: 4px"
            lineChar.style = "text-transform: capitalize"
            lineChar.innerHTML = `${attr[0]}: ${attr[1]}`
            charsDiv.appendChild(lineChar)
        })

        const commentsDiv = document.createElement("div")
        commentsDiv.style = "padding: 2px 30px"
        cardInfo.appendChild(commentsDiv)

        const lineComment = document.createElement("p")
        lineComment.innerHTML = detail.comments
        commentsDiv.appendChild(lineComment)

        return {
            'data': {
                'id': id,
                'label': label || `n${this.cy.nodes().length}`,
                'dom': cardInfo,
            },
            'renderedPosition': rp,
        };
    }

    cardItem = (data) => {
        data.id = `cardItem${data.id}`
        const cardItem = document.createElement("div")
        cardItem.className = 'draggable'
        cardItem.style = "font-size: 20px;border-radius: 15px;padding: 8px 20px;position: relative;width: 150px;height: 75px;background-color: #d2d0d1;text-align: text-center;"

        const type = document.createElement("p")
        type.style = "font-weight: 700; margin: 0px;text-align: center;text-transform: capitalize;"
        type.innerHTML = data.type

        const content = document.createElement("p")
        content.style = "margin: 0px;text-align: center;"
        content.innerHTML = data.title

        const styleElem = document.head.appendChild(document.createElement("style"));
        cardItem.setAttribute("id", data.id);
        //const defaultImage = `imgs/${data.type}.svg`
        const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Circle-icons-profile.svg'

        styleElem.innerHTML = `#${data.id}:before {
        content: url("${data.detail.image}");
        position: absolute;
        top: -1px;
        left: -30px;
        transform: translate(50%,-50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #d2d0d1;
        background: #ffffff;
        background-repeat:no-repeat;
    }`


        cardItem.appendChild(type)
        cardItem.appendChild(content)
        const rp = undefined;

        return {
            'group': 'nodes',
            'data': {
                'dom': cardItem,
                ...data
            },
            'renderedPosition': rp,
        }
    }

    layout = () => {
        let options = {
            name: 'grid',
            fit: true,
            padding: 10,
            avoidOverlap: true,
            spacingFactor: 1.8,
        };

        this.cy.layout(options).run();
    }

    setUpListeners2 = () => {
        this.cy.on('click', 'node', (event) => {
            console.log(event.target)
        })
    }

    setUpListeners = () => {
        const cy = this.cy;
        const cardInfo = this.cardInfo;
        cy.on('tap', 'node', function(evt) {
            console.log("Yeeeeahhhh");
            const node = evt.target;
            const cardInfoId = node.id().replace('Item', 'Info');
            const cardInfoGetted = cy.nodes(`[id = "${cardInfoId}"]`);
            const data = node.data();
            const positionCardItem = node.position();
            const positionCardInfo = { ...positionCardItem };
            if (positionCardItem.y < (window.innerHeight / 2)) {
                positionCardInfo.y = positionCardInfo.y - 300;
            } else {
                positionCardInfo.y = positionCardInfo.y + 300;
            }

            const cardInfoData = {
                cardInfoId,
                label: true,
                rp: null,
                detail: {
                    title: data.title,
                    ...data.detail
                }
            }

            if (!cardInfoGetted.length) {
                cy.layout({ name: 'grid' }).stop();
                cy.add(cardInfo(cardInfoData));
                const otro = cy.nodes(`[id = "${cardInfoId}"]`);
                otro.position(positionCardInfo);
            } else {
                const cardData = cardInfoGetted.data()
                const domCard = document.getElementById(cardData.id);
                if (domCard !== null) domCard.remove();
                cy.remove(`[id = "${cardInfoId}"]`);
            }
        });
    }

    render() {
        return(
            <div>
                <CytoscapeComponent
                    elements={[].concat(this.request, this.edges)}
                    style={{
                        height: '100vh',
                        width: '100vw',
                        position: 'absolute',
                        left: 0,
                        top: 0,}}
                    layout={{
                        name: 'grid',
                        fit: true,
                        padding: 50,
                        avoidOverlap: true,
                        spacingFactor: 1.8,
                    }}
                    stylesheet={stylesheet}
                    boxSelectionEnabled={true}
                    autounselectify={false}
                    cy={(cy) => {this.cy = cy}}
                />
            </div>
        )
    }
}