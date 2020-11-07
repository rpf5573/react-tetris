import React from 'react';
import Immutable from 'immutable';
import propTypes from 'prop-types';

import style from './index.less';
import Button from './button';
import store from '../../store';
import todo from '../../control/todo';
import { i18n, lan } from '../../unit/const';

export default class Keyboard extends React.Component {
  componentDidMount() {
    /** 
     * 핸드폰 조작에 대하여 touchstart를 촉발하였는데, 다시는 뒤의 mouse 사건을 촉발하지 않도록 기록을 할 것이다
     */
    const touchEventCatch = {};

    /**
     * 마우스가 mousedown을 촉발할 때, 원소를 제거할 때 mouseup을 건드리지 않아도 되는데, 여기서 호환성을 만들어 mouseout으로 mouseup을 시뮬레이션한다
     * 근데, 나는 마우스는 안쓸거니까, pass해도 될듯
     * 
     * 아, 마우스가 아니라, 핸드폰에서 핸드폰에서 문제가 있네,
     * 생각해보니까 이 프로젝트가 핸드폰에서도 잘 작동하도록 만들어진거니까, 여기 코드도 중요하넴
     */

    const mouseDownEventCatch = {};

    document.addEventListener('touchstart', (e) => {
      /** 
       * touchstart 타입의 이벤트는 모두 차단한다. 왜???
       * 그 핸드폰에서는 줌인 줌아웃되는데, 그게 touchstart랑 관련이 있어서 그런거 아닐까?
       * 그래서 아예 touchstart를 쓰지 말자는거지. 그러면 줌인/줌아웃도 발생하지 않을테니까
       */
      if (e.preventDefault) {
        e.preventDefault();
      }
      /** 이벤트 전파 방식은 capturing을 사용한다. 인즉, window > body > container > inner > target순으로 이벤트가 호출된다. */
    }, true);

    // issue: https://github.com/chvin/react-tetris/issues/24
    /** 
     * 위의 이슈를 해결하기 위해서, 터치가 끝났을때의 발생되는 모든 이벤트들은 막는다.
     */
    document.addEventListener('touchend', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    }, true);

    // 두손가락으로 확대하는거(줌인)를 막는다
    document.addEventListener('gesturestart', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    });
    /**
     * mousedown은 뜬금없이 왜막노, 그리고 왜 이거는 capturing방식을 택한거지?
     */
    document.addEventListener('mousedown', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    }, true);

    Object.keys(todo).forEach((key) => {
      this[`dom_${key}`].dom.addEventListener('mousedown', () => {
        if (touchEventCatch[key] === true) {
          return;
        }
        todo[key].down(store);
        mouseDownEventCatch[key] = true;
      }, true);
      this[`dom_${key}`].dom.addEventListener('mouseup', () => {
        if (touchEventCatch[key] === true) {
          touchEventCatch[key] = false;
          return;
        }
        todo[key].up(store);
        mouseDownEventCatch[key] = false;
      }, true);
      this[`dom_${key}`].dom.addEventListener('mouseout', () => {
        if (mouseDownEventCatch[key] === true) {
          todo[key].up(store);
        }
      }, true);
      this[`dom_${key}`].dom.addEventListener('touchstart', () => {
        touchEventCatch[key] = true;
        todo[key].down(store);
      }, true);
      this[`dom_${key}`].dom.addEventListener('touchend', () => {
        todo[key].up(store);
      }, true);
    });
  }
  shouldComponentUpdate({ keyboard, filling }) {
    return !Immutable.is(keyboard, this.props.keyboard) || filling !== this.props.filling;
  }
  render() {
    const keyboard = this.props.keyboard;
    return (
      <div
        className={style.keyboard}
        style={{
          marginTop: 20 + this.props.filling,
        }}
      >
        <Button
          color="blue"
          size="s1"
          top={0}
          left={374}
          label={i18n.rotation[lan]}
          arrow="translate(0, 63px)"
          position
          active={keyboard.get('rotate')}
          ref={(c) => { this.dom_rotate = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={180}
          left={374}
          label={i18n.down[lan]}
          arrow="translate(0,-71px) rotate(180deg)"
          active={keyboard.get('down')}
          ref={(c) => { this.dom_down = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={90}
          left={284}
          label={i18n.left[lan]}
          arrow="translate(60px, -12px) rotate(270deg)"
          active={keyboard.get('left')}
          ref={(c) => { this.dom_left = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={90}
          left={464}
          label={i18n.right[lan]}
          arrow="translate(-60px, -12px) rotate(90deg)"
          active={keyboard.get('right')}
          ref={(c) => { this.dom_right = c; }}
        />
        <Button
          color="blue"
          size="s0"
          top={100}
          left={52}
          label={`${i18n.drop[lan]} (SPACE)`}
          active={keyboard.get('drop')}
          ref={(c) => { this.dom_space = c; }}
        />
        <Button
          color="red"
          size="s2"
          top={0}
          left={196}
          label={`${i18n.reset[lan]}(R)`}
          active={keyboard.get('reset')}
          ref={(c) => { this.dom_r = c; }}
        />
        <Button
          color="green"
          size="s2"
          top={0}
          left={106}
          label={`${i18n.sound[lan]}(S)`}
          active={keyboard.get('music')}
          ref={(c) => { this.dom_s = c; }}
        />
        <Button
          color="green"
          size="s2"
          top={0}
          left={16}
          label={`${i18n.pause[lan]}(P)`}
          active={keyboard.get('pause')}
          ref={(c) => { this.dom_p = c; }}
        />
      </div>
    );
  }
}

Keyboard.propTypes = {
  filling: propTypes.number.isRequired,
  keyboard: propTypes.object.isRequired,
};
