import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import propTypes from 'prop-types';

import style from './index.less';

import Matrix from '../components/matrix';
import Decorate from '../components/decorate';
import Number from '../components/number';
import Next from '../components/next';
import Music from '../components/music';
import Pause from '../components/pause';
import Point from '../components/point';
import Logo from '../components/logo';
import Keyboard from '../components/keyboard';
import Guide from '../components/guide';

import { transform, lastRecord, speeds, i18n, lan } from '../unit/const';
import { visibilityChangeEvent, isFocus } from '../unit/';
import states from '../control/states';

class App extends React.Component {
  constructor() {
    super();
    /**
     * 초장에 화면 크기 값들 넣기
     */
    this.state = {
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    };
  }
  componentWillMount() {
    /**
     * componenetWillMount말고 componentDidMount에 이벤트리스너를 추가해도 됬을것 같은데,,, 아니면 constructor에 하든지.
     * 내가 할때는 다른곳에 넣어봐야겠다. 어차피 React 16.13버전에서는 componentWillMount 사용을 지양하니까.
     * 
     * 아무튼, 아래 코드는 화면이 resize되었을때 이 컴포넌트의 resize함수를 호출한다.
     * 의도는, 화면 크기가 바뀔때마다 그 크기에 맞게 게임기의 크기를 변경해 주기 위해서!
     */
    window.addEventListener('resize', this.resize.bind(this), true);
  }
  componentDidMount() {
    /**
     * 브라우저에서 해당 기능을 지원하는지 체크하는건데,
     * visibilityChangeEvent는 사용자가 이 게임탭을 active상태로 하고있는지, 안하고 있는지를 알려준다.
     * 그래서 브라우저에서 지원하면, 사용자가 이 게임탭을 벗어났을때 focus함수를 통해서,,,아마도,,,게임을 잠깐 멈출것 같은데.
     */
    if (visibilityChangeEvent) { // 将页面的焦点变换写入store
      document.addEventListener(visibilityChangeEvent, () => {
        states.focus(isFocus());
      }, false);
    }

    /**
     * 이전 기록이 있다면,, 이 lastRecord는 localStorage안에 있는거야. 브라우저 cache에 저장하는거지.
     */
    if (lastRecord) { 
      /**
       * lastRecord.cur 은 (아마도!) 현재 screen에 있는 block을 말하는것같음. 아, lastRecord니까,, 아까(?) 화면에 떠있는 block을 말하는것일수도 있음.
       * lastRecord.pause는 일전에 게임할때 멈춤상태였는지를 체크하는거야, 이전에 멈춤상태였다면 지금 새로 불러왔을때도 멈춤으로 해놓는거지.
       * 맞아? 이건 좀 의심된다.
       */
      if (lastRecord.cur && !lastRecord.pause) {
        /**
         * speedRun은 그 block이 떨어지는 속도를 의미하는거야.
         * 게임 시작할때 설정하는 그거.
         */
        const speedRun = this.props.speedRun;
        /**
         * 해당 스피드의 반절을 timeout으로 설정한다.
         * 예를들어서, 최고 스피드인 160ms으로 설정했다면, 80ms마다 도형이 한칸씩 떨어진다.
         * 아니 근데, 밑에 코드에서 timeout을 업데이트 해버리는데, 이게 뭔 소용이람?
         * 내가할때는 지워야겠다
         */
        let timeout = speeds[speedRun - 1] / 2;
        /**
         * props로 넘겨받은 speedRun이 사용자가 설정할 수 있는 최고 스피드보다 작으면, 최고 스피드로 하고,
         * 아니면 props로 넘겨받은 speedRun으로 한다. 그러니까, 160ms마다 한칸씩 떨어지는게 제일 빠른건데, 이거를 어기고
         * 뭔가 이상한 방법을 써서 120ms마다 한칸씩 떨어지도록 했다고 치면, 160ms로 설정하고, 그게 아니라면 원래 설정한 speedRun으로 한다는 말이다.
         * 그러면 그냠 max함수 쓰면 되는거 아닌가? 예를들어서, timeout max(speedRun, speeds[speeds.length-1]) 이런식으로.
         */
        timeout = speedRun < speeds[speeds.length - 1] ? speeds[speeds.length - 1] : speedRun;
        /**
         * timeout때마다, 자동으로 한칸씩 도형이 떨어지도록 한다. 다시말해서 160ms마다 자동으로 한칸씩 떨어지도록.
         */
        states.auto(timeout);
      }
      /**
       * 이전 기록에서 screen에 나와있는 블럭이 없다면
       * lock하고, reset하고, 시작한다(pause(false))
       */
      if (!lastRecord.cur) {
        states.overStart();
      }
    } else {
      /**
       * 이전 기록이 아무것도 없다면
       * 그러니까, 처음 시작하는거라면
       * 시작한다.
       */
      states.overStart();
    }
  }
  /**
   * 브라우저 크기가 바뀔때마다 w와h를 업데이트한다.
   * 그리고 re-render가 될것이다. 왜 w, h를 업데이트 하는지는 render()함수를 보면 알수있다.
   */
  resize() {
    this.setState({
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    });
  }
  render() {
    /**
     * filling이라는거는, 화면을 세로로 길게 만들었을때 예를들면, 스마트폰 같은경우 세로가 가로에 비해 많이 길잖아 뭐 암튼 그런경우
     * 화면을 위아래로 꽉 체우는데, 얼마를 채워야 하는지 그 정도를 나타낸다.
     */
    let filling = 0;

    /**
     * size 함수는 container에 적용될 css코드를 계산해서 돌려준다.
     */
    const size = (() => {
      const w = this.state.w; // 브라우저의 가로길이
      const h = this.state.h; // 브라우저의 세로길이
      /**
       * 세로/가로 비율.
       */
      const ratio = h / w;
      /**
       * 게임기를 어느정도 축소/확대할것인지 scale을 계선해서 넣을것이다.
       */
      let scale;
      /**
       * 여기에 계산된 css를 넣을거야.
       */
      let css = {};
      /**
       * container의 가로길이는 640px로 정해져있어. 세로길이도 960px으로 정해져있어.
       * 즉, 세로 : 가로 = 3 : 2 다.
       * 
       * 근데 브라우저의 세로길이가 예를들어서, 600px이고 가로길이가 1200px이라 치면
       * ratio는 0.5이다.
       */
      if (ratio < 1.5) {
        /**
         * 그러면 3 : 2비율에 맞게 저 게임기 사이즈를 줄여야한다. 세로가 짧으니까 세로길이에 맞추자.
         * 게임기의 세로길이는 960 * (600/960) 하고, 게임기의 가로길이는 640 * (600/960) 이다.
         * 다시말해서, 게임기의 세로길이를 브라우저의 세로길이에 맞게 해야하기 때문에 세로길이를 맞추는데
         * 세로길이를 줄이고, 세로길이를 줄인 그 만큼 가로길이를 줄여야한다.
         * 그래서 scale이 h / 960이 되는거다.
         */
        scale = h / 960;
      } else {
        /**
         * 만약에 브라우저의 세로길이가 1000px 이고 가로길이가 500px이라면, 세로길이가 더 길기 때문에
         * 게임기의 3 : 2 비율이 또 깨진다. 그래서 가로길이를 줄여야 한다. 640 * (500/640) 하면 딱 500이 나온다.
         * 그리고 세로길이도 그만큼 줄여야 하기 때문에 960 * (500/640) 을 한다. 
         * 
         * 근데!!! 3 : 2비율이 이런식으로 세로가 많이 길어져서 깨지면 (미래의 아이폰 15의 모습?) 3 : 2 비율을 버리고
         * 세로를 꽉 체워야 한다. 그래서 filling이 있는거다.
         * 
         * 그러면 위아래를 얼마만큼 체워야 하는걸까?
         * 
         * 
         * filling = (1000 - (960 * (500/640))) / (500/640) / 3
         * 1000 - (960 * (500/640)) = 위아래로 모자란 부분
         * 1000 - 750 = 250px
         * 250 / (500/640) = 250 * (640/500) = 320
         * 
         * 왜 250을 scale로 또 나눈걸까?
         * 왜냐면 어쨋든 브라우저의 높이와 게임기의 높이는 250px만큼 무적권 차이가 난다.
         * 250px만 줄여주면 되는데,, 문제는 scale이 맨 나중에 적용되기 때문에
         * 250px 에 scale을 곱한 값이 줄여지게된다. 앗 ! 우리는 250px을 줄여야 하는데
         * 결과적으로는 195.3125가 줄여지게 된다. 그래서 우리는 미리 미리 미리 scale을 뒤집어 놓은
         * 값을 곱해 놓는거야. 그러면 나중에 scale을 곱했을떄 250이 될테니까!
         * 즉, 250 * (640/500) = 320 을 한값을 filling으로 치면 나중에 320 * (500/640) = 250이 되니까,
         * 250px만큼이 줄어든다.
         * 
         * 잠깐!! filling은 250 이나리 마지막에 3으로 나눈 83.333 이 된다.
         * 왜? 3으로 나눈거지? 
         */
        scale = w / 640;
        filling = (h - (960 * scale)) / scale / 3;
        css = {
          paddingTop: Math.floor(filling) + 42,
          paddingBottom: Math.floor(filling),
          marginTop: Math.floor(-480 - (filling * 1.5)),
        };
      }
      css[transform] = `scale(${scale})`;
      return css;
    })();

    return (
      <div
        className={style.app}
        style={size}
      >
        <div className={classnames({ [style.rect]: true, [style.drop]: this.props.drop })}>
          <Decorate />
          <div className={style.screen}>
            <div className={style.panel}>
              <Matrix
                matrix={this.props.matrix}
                cur={this.props.cur}
                reset={this.props.reset}
              />
              <Logo cur={!!this.props.cur} reset={this.props.reset} />
              <div className={style.state}>
                <Point cur={!!this.props.cur} point={this.props.points} max={this.props.max} />
                <p>{ this.props.cur ? i18n.cleans[lan] : i18n.startLine[lan] }</p>
                <Number number={this.props.cur ? this.props.clearLines : this.props.startLines} />
                <p>{i18n.level[lan]}</p>
                <Number
                  number={this.props.cur ? this.props.speedRun : this.props.speedStart}
                  length={1}
                />
                <p>{i18n.next[lan]}</p>
                <Next data={this.props.next} />
                <div className={style.bottom}>
                  <Music data={this.props.music} />
                  <Pause data={this.props.pause} />
                  <Number time />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Keyboard filling={filling} keyboard={this.props.keyboard} />
        <Guide />
      </div>
    );
  }
}

App.propTypes = {
  music: propTypes.bool.isRequired,
  pause: propTypes.bool.isRequired,
  matrix: propTypes.object.isRequired,
  next: propTypes.string.isRequired,
  cur: propTypes.object,
  dispatch: propTypes.func.isRequired,
  speedStart: propTypes.number.isRequired,
  speedRun: propTypes.number.isRequired,
  startLines: propTypes.number.isRequired,
  clearLines: propTypes.number.isRequired,
  points: propTypes.number.isRequired,
  max: propTypes.number.isRequired,
  reset: propTypes.bool.isRequired,
  drop: propTypes.bool.isRequired,
  keyboard: propTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  pause: state.get('pause'),
  music: state.get('music'),
  matrix: state.get('matrix'),
  next: state.get('next'),
  cur: state.get('cur'),
  speedStart: state.get('speedStart'),
  speedRun: state.get('speedRun'),
  startLines: state.get('startLines'),
  clearLines: state.get('clearLines'),
  points: state.get('points'),
  max: state.get('max'),
  reset: state.get('reset'),
  drop: state.get('drop'),
  keyboard: state.get('keyboard'),
});

export default connect(mapStateToProps)(App);
