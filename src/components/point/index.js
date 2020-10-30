import React from 'react';
import propTypes from 'prop-types';

import Number from '../number';
import { i18n, lan } from '../../unit/const';

const DF = i18n.point[lan];
const ZDF = i18n.highestScore[lan];
const SLDF = i18n.lastRound[lan];

export default class Point extends React.Component {
  constructor() {
    super();
    this.state = {
      label: '',
      number: 0,
    };
  }
  componentWillMount() {
    /**
     * 이 코드를 왜쓴거야? onChange에 this.props를 왜 넣은걸까?
     * componentWillMount는 실제로 DOM에 붙기 직전에 호출된다.
     * 왜 호출했을까?
     * render하기 전에 호출이 되는구마잉. 이거 호출되자 마자 render가 호출되겠지
     */
    this.onChange(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.onChange(nextProps);
  }
  shouldComponentUpdate({ cur, point, max }) {
    const props = this.props;
    return cur !== props.cur || point !== props.point || max !== props.max || !props.cur;
  }
  /**
   * 
   * 여기 이 cur는 무엇을 의미하는걸까? 
   */
  onChange({ cur, point, max }) {
    clearInterval(Point.timeout);
    if (cur) { // 게임이 진행중이라면?

      /**
        * 아니 근데, componentWillMount에서도 onChange를 호출했는데, 이렇게 되면
        * setState를 호출하는게 좀 오바마 아닌가? 
      */
      this.setState({
        label: point >= max ? ZDF : DF,
        number: point,
      });
    } else { // 게임이 시작하기 전이라면
      const toggle = () => { // 최고득점과 이전 득점이 번갈아 가면서 나온다
        this.setState({
          label: SLDF,
          number: point,
        });
        Point.timeout = setTimeout(() => {
          this.setState({
            label: ZDF,
            number: max,
          });
          Point.timeout = setTimeout(toggle, 3000);
        }, 3000);
      };

      if (point !== 0) { // 지난라운드때 뭔가 해서 포인트가 있었다면, 전광판에 번갈아 띄워준다
        toggle();
      } else {
        this.setState({
          label: ZDF,
          number: max,
        });
      }
    }
  }
  
  render() {
    return (
      <div>
        <p>{ this.state.label }</p>
        <Number number={this.state.number} />
      </div>
    );
  }
}

Point.statics = {
  timeout: null,
};

Point.propTypes = {
  cur: propTypes.bool,
  max: propTypes.number.isRequired,
  point: propTypes.number.isRequired,
};

