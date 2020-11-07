import React from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';

import style from './index.less';
import { transform } from '../../../unit/const';

/** 게임 화면 아래에 있는 동그란 버튼들의 부모 Component이다. */
export default class Button extends React.Component {
  shouldComponentUpdate(nextProps) {
    /** 
     * 누른상태는 active가 true가 되는데, 이런 경우 버튼의 디자인이 약간 달라지고,
     * 또, 땐 상태에서는 active가 false가 되는데, 이런 경우도 버튼의 디자인이 달라진다.
     * 그래서 active가 달라졌으면 그리는게 맞긴 한데,,, 이게 달라지는건 언제나 당연한거,,,가 아니구나.
     * 다른 컴포넌트에서 action을 dispatch해서 store.state가 변경되고, 그래서 다시 다 그릴려고 할텐데,
     * 이 버튼이 눌린건 아니니까, 이 버튼은 그려줄 필요가 없구나.
     * 이런 사소한 퍼포먼스 까지 신경쓰다니,,,역시 좋은 프로젝트야.
     */
    return nextProps.active !== this.props.active;
  }
  render() {
    /** 오, 이렇게 props에 있는거를 한줄로 빼내서 가져오는것도 멋진 technique야 ! */
    const {
      active, color, size, top, left, label, position, arrow,
    } = this.props;
    return (
      <div
        /** 생각났다. object의 key는 문자열이어야 하는데, 변수를 key로 쓰고 싶을때는 이렇게 [](대괄호)를 쓰는구나! */
        className={cn({ [style.button]: true, [style[color]]: true, [style[size]]: true })}
        style={{ top, left }}
      >
        <i
          className={cn({ [style.active]: active })}
          ref={(c) => { this.dom = c; }}
        />
        { size === 's1' && <em
          style={{
            [transform]: `${arrow} scale(1,2)`,
          }}
        /> }
        <span className={cn({ [style.position]: position })}>{label}</span>
      </div>
    );
  }
}

Button.propTypes = {
  color: propTypes.string.isRequired,
  size: propTypes.string.isRequired,
  top: propTypes.number.isRequired,
  left: propTypes.number.isRequired,
  label: propTypes.string.isRequired,
  position: propTypes.bool,
  arrow: propTypes.string,
  active: propTypes.bool.isRequired,
};

