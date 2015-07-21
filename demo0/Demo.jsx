/*eslint-disable */

import React from 'react';
import {TransitionSpring} from '../src/Spring';
import Gesture from '../Gesture'

// console.log = function(...args){
//   let div = document.createElement('div');
//   div.textContent = JSON.stringify(args.join(' '));
//   let parent = document.querySelector('#content');
//   parent.insertBefore(div, parent.firstChild);
// };

let Demo = React.createClass({
  getInitialState() {
    return {
      photos: {
        './0.jpg': [500, 350]
      },
      currPhoto: 0,
    };
  },

  intricateSet(value, [vx, vy]) {
    let {currPhoto, photos} = this.state;
    let retValue = JSON.parse(JSON.stringify(value));
    const currKey = Object.keys(photos)[currPhoto];
    retValue[currKey].val.left += -vx * 2000;
    retValue[currKey].val.top += -vy * 2000;
    console.log('intricateSet', retValue[currKey].val.left, retValue[currKey].val.top);
    return retValue;
  },

  handleChange({target: {value}}) {
    // let {photos} = this.state;
    // this.setState({currPhoto: value});
    // if (parseInt(value) === Object.keys(photos).length - 1) {
    //   let w = Math.floor(Math.random() * 500 + 200);
    //   let h = Math.floor(Math.random() * 500 + 200);
    //   let hash = (Math.random() + '').slice(3);
    //   this.setState({
    //     photos: {
    //       ...photos,
    //       // What the hell are you doing chenglou?

    //       // I'm loading pictures on the fly and using the default
    //       // transitionless (!) `willEnter` to place the picture on the page.
    //       // essentially, I'm abusing the diffing/merging algorithm to animate
    //       // from one (more or less) arbitrary data structure to another, and It
    //       // Just Works.
    //       [`http://lorempixel.com/${w}/${h}/sports/a${hash}`]: [w, h],
    //     },
    //   });
    // }
  },

  getValues([deltaX, deltaY], touchDown) {
    let {photos, currPhoto} = this.state;
    let keys = Object.keys(photos);
    let currKey = keys[currPhoto];
    let [width, height] = photos[currKey];
    let widths = keys.map(key => {
      let [origW, origH] = photos[key];
      return height / origH * origW;
    });
    let offset = 0;
    for (var i = 0; i < widths.length; i++) {
      if (keys[i] === currKey) {
        break;
      }
      offset -= widths[i];
    }
    let configs = {};
    keys.reduce((prevLeft, key, i) => {
      let [origW, origH] = photos[key];
      configs[key] = {
        val: {
          left: prevLeft,
          top: 0,
          height: height,
          width: height / origH * origW,
        },
        config: [100, 8],
      };
      return prevLeft + widths[i];
    }, offset);
    configs.container = {val: {height, width}};

    if(touchDown) {
      configs[currKey].val.left += deltaX;
      configs[currKey].val.top += deltaY;
      configs[currKey].config = [];
    }
    return configs;
    // let {photos, currPhoto} = this.state;
    // let keys = Object.keys(photos);
    // let currKey = keys[currPhoto];
    // let [width, height] = photos[currKey];
    // let widths = keys.map(key => {
    //   let [origW, origH] = photos[key];
    //   return height / origH * origW;
    // });
    // let offset = 0;
    // for (var i = 0; i < widths.length; i++) {
    //   if (keys[i] === currKey) {
    //     break;
    //   }
    //   offset -= widths[i];
    // }
    // let configs = {};
    // keys.reduce((prevLeft, key, i) => {
    //   let [origW, origH] = photos[key];
    //   configs[key] = {
    //     val: {
    //       left: prevLeft,
    //       height: height,
    //       width: height / origH * origW,
    //     },
    //     config: [100, 10],
    //   };
    //   return prevLeft + widths[i];
    // }, offset);
    // configs.container = {val: {height, width}};

    // if(touchDown) {
      // configs[currKey].val.left += deltaX;
      // configs[currKey].val.top += deltaY;
      // configs[currKey].config = [];
    // }
    // return configs;
  },

  setCurrValue([deltaX, deltaY], touchDown, currValue) {
    if(!touchDown) return currValue;
    let {photos, currPhoto} = this.state;
    let currKey = Object.keys(photos)[currPhoto];

    let newCurrValue = JSON.parse(JSON.stringify(currValue));
    newCurrValue[currKey].val.left += deltaX;
    newCurrValue[currKey].val.top += deltaY;
    newCurrValue[currKey].config = [];

    return newCurrValue
  },

  render() {
    let {photos, currPhoto} = this.state;
    return (
      <Gesture>
        {(touchDown, mouseDelta, velocity, flick) =>
          <div>
            {flick + " - " + touchDown + " - " + (touchDown ? mouseDelta : [0, 0])}
            <TransitionSpring
              className="demo4"
              endValue={this.getValues.bind(null, mouseDelta, touchDown)}
              testFlick={flick}
              currVelocity={currV => flick ? this.intricateSet(currV, velocity) : currV}
              // currValue={this.setCurrValue.bind(null, mouseDelta, touchDown)}
              >
              {({container, ...rest}) =>
                <div className="demo4-inner" style={container.val}>
                  {Object.keys(rest).map((key) =>
                    <img
                      className="demo4-photo"
                      key={key}
                      src={key}
                      style={makeTransition(rest[key].val)} />
                  )}
                </div>
              }
            </TransitionSpring>
          </div>
        }
      </Gesture>
    );
  }
});

function makeTransition({top, left}) {
  return {
    position: 'absolute',
    MsTransform: `translate(${left}px,${top}px)`,
    WebkitTransform: `translate(${left}px,${top}px)`,
    transform: `translate(${left}px,${top}px)`,
  }
}

export default Demo;