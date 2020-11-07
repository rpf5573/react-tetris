import React from 'react';
import cn from 'classnames';

import { i18n, lan } from '../../unit/const';
import style from './index.less';

/**
 * 게임창을 꾸며주는 컴포넌트
 */
export default class Decorate extends React.Component {
  shouldComponentUpdate() {
    // 이 컴포넌트는 절대 re-render하지 않겠다는 굳은 의지
    return false;
  }
  render() {
    return (
      <div className={style.decorate}>
        <div className={style.topBorder}>
          <span className={cn(['l', style.mr])} style={{ width: 40 }} />
          <span className={cn(['l', style.mr])} />
          <span className={cn(['l', style.mr])} />
          <span className={cn(['l', style.mr])} />
          <span className={cn(['l', style.mr])} />
          <span className={cn(['r', style.ml])} style={{ width: 40 }} />
          <span className={cn(['r', style.ml])} />
          <span className={cn(['r', style.ml])} />
          <span className={cn(['r', style.ml])} />
          <span className={cn(['r', style.ml])} />
        </div>
        <h1>{i18n.title[lan]}</h1>
        <div className={style.view}>
          <b className="c" />
          <div className="clear" />
          <b className="c" />
          <b className="c" />
          <div className="clear" />
          <em />
          <b className="c" />
          <p />
          <em />
          <b className="c" />
          <div className="clear" />
          <b className="c" />
          <b className="c" />
          <div className="clear" />
          <em />
          <b className="c" />
          <p />
          <b className="c" />
          <b className="c" />
          <b className="c" />
          <b className="c" />
          <p />
          <b className="c" />
          <div className="clear" />
          <b className="c" />
          <b className="c" />
          <div className="clear" />
          <b className="c" />
          <p />
          <b className="c" />
          <b className="c" />
          <div className="clear" />
          <b className="c" />
          <div className="clear" />
          <b className="c" />
          <p />
          <em />
          <b className="c" />
          <div className="clear" />
          <em />
          <b className="c" />
          <div className="clear" />
          <em />
          <b className="c" />
          <div className="clear" />
          <em />
          <b className="c" />
        </div>
        <div className={cn([style.view, style.l])}>
          <em />
          <b className="c" />
          <div className="clear" />
          <b className="c" />
          <b className="c" />
          <div className="clear" />
          <b className="c" />
          <p />
          <b className="c" />
          <div className="clear" />
          <b className="c" />
          <b className="c" />
          <div className="clear" />
          <b className="c" />
          <p />
          <b className="c" />
          <b className="c" />
          <b className="c" />
          <b className="c" />
          <p />
          <em />
          <b className="c" />
          <div className="clear" />
          <b className="c" />
          <b className="c" />
          <div className="clear" />
          <em />
          <b className="c" />
          <p />
          <b className="c" />
          <b className="c" />
          <div className="clear" />
          <em />
          <b className="c" />
          <div className="clear" />
          <em />
          <b className="c" />
          <p />
          <b className="c" />
          <div className="clear" />
          <b className="c" />
          <div className="clear" />
          <b className="c" />
          <div className="clear" />
          <b className="c" />
        </div>
      </div>
    );
  }
}
