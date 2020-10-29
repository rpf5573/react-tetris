import { List } from 'immutable';
import store from '../store';
import { want, isClear, isOver } from '../unit/';
import actions from '../actions';
import { speeds, blankLine, blankMatrix, clearPoints, eachLines } from '../unit/const';
import { music } from '../unit/music';

/**
 * 시작 메트릭스를 얻는다?
 * 맨 처음에 시작할때 그 빈 매트릭스를 얻는것 같은데
 */
const getStartMatrix = (startLines) => {
  /**
   * min, max 왜필요하노~?
   * 뭐가 최소고 뭐가 최대라는거지?
   */
  const getLine = (min, max) => {
    /**
     * count는 min ~ max 까지 나오겠네
     * 이 카운트가 뭘 의미하는걸까?
     */
    const count = parseInt((((max - min) + 1) * Math.random()) + min, 10);
    const line = [];
    /**
     * 이거는 검정 벽돌을 넣는 개수를 말하는거고
     */
    for (let i = 0; i < count; i++) {
      line.push(1);
    }

    /**
     * 이 코드를 돌리면 이렇게 된다.
     * line = [1, 1, 1, 1]
     * 
     * line = [0, 1, 0, 0, 1, 1, 0, 1, 0, 0]
     * 1이 4개있는건 변함이 없지만 0이 랜덤하게 사이사이에 낀다. 물론
     * line = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0] 이렇게 될 수도 있겠징?
     */
    for (let i = 0, len = 10 - count; i < len; i++) {
      const index = parseInt(((line.length + 1) * Math.random()), 10);
      
      /**
       * var arr = [1, 2, 3, 4, 5]
       * arr.splice(2, 0, 0) ==> [1, 2, 0, 3, 4, 5]
       * 약간 중간에 끼워 넣는게 가능하다!
       */
      line.splice(index, 0, 0);
    }

    return List(line);
  };
  let startMatrix = List([]);

  /**
   * 이거는 라인에 따라서 회색 벽돌이 더 많아질 수도 있음을 의미한다.
   * 여기서는 라인의 인덱스가 위쪽이 작고 아래쪽이 크다. 그래서 결과적으로 아래쪽에는 회색벽돌이 많고, 상대적으로 위쪽에는 회색벽돌이 적다.
   */
  for (let i = 0; i < startLines; i++) {
    if (i <= 2) { // 0-3
      startMatrix = startMatrix.push(getLine(5, 8));
    } else if (i <= 6) { // 4-6
      startMatrix = startMatrix.push(getLine(4, 9));
    } else { // 7-9
      startMatrix = startMatrix.push(getLine(3, 9));
    }
  }

  /**
   * 이게 그러면 이렇게 되는거네, 맨아래쪽에는 회색벽돌이 많고, 위로 갈수록 회색 벽돌이 적어지는데,
   * 그 startline윗부분은 전부 회색벽돌
   */
  for (let i = 0, len = 20 - startLines; i < len; i++) { // 插入上部分的灰色
    startMatrix = startMatrix.unshift(List(blankLine));
  }
  return startMatrix;
};

const states = {
  /**
   * 자동으로 떨어지는 setTimeout 변수
   */
  fallInterval: null,

  // 게임시작
  start: () => {
    if (music.start) {
      music.start();
    }
    const state = store.getState();
    states.dispatchPoints(0); // point를 0으로 초기화
    /**
     * speedRun은 뭐냐? speedStart는 또 뭐고?
     */
    store.dispatch(actions.speedRun(state.get('speedStart')));
    /**
     * 그러네, 시작하기 전에 startLines를 설정하고 시작하니까, state에 startLines값이 있겠구만.
     */
    const startLines = state.get('startLines');
    /**
     * startLines를 바탕으로 matrix를 가져온다.
     */
    const startMatrix = getStartMatrix(startLines);
    /**
     * matrix action은 뭐야,,, 무슨 의도를 갖고 dispatch한거야?
     */
    store.dispatch(actions.matrix(startMatrix));
    store.dispatch(actions.moveBlock({ type: state.get('next') }));
    store.dispatch(actions.nextBlock());
    states.auto();
  },

  // 自动下落
  auto: (timeout) => {
    const out = (timeout < 0 ? 0 : timeout);
    let state = store.getState();
    let cur = state.get('cur');
    const fall = () => {
      state = store.getState();
      cur = state.get('cur');
      const next = cur.fall();
      if (want(next, state.get('matrix'))) {
        store.dispatch(actions.moveBlock(next));
        states.fallInterval = setTimeout(fall, speeds[state.get('speedRun') - 1]);
      } else {
        let matrix = state.get('matrix');
        const shape = cur && cur.shape;
        const xy = cur && cur.xy;
        shape.forEach((m, k1) => (
          m.forEach((n, k2) => {
            if (n && xy.get(0) + k1 >= 0) { // 竖坐标可以为负
              let line = matrix.get(xy.get(0) + k1);
              line = line.set(xy.get(1) + k2, 1);
              matrix = matrix.set(xy.get(0) + k1, line);
            }
          })
        ));
        states.nextAround(matrix);
      }
    };
    clearTimeout(states.fallInterval);
    states.fallInterval = setTimeout(fall,
      out === undefined ? speeds[state.get('speedRun') - 1] : out);
  },

  // 一个方块结束, 触发下一个
  nextAround: (matrix, stopDownTrigger) => {
    clearTimeout(states.fallInterval);
    store.dispatch(actions.lock(true));
    store.dispatch(actions.matrix(matrix));
    if (typeof stopDownTrigger === 'function') {
      stopDownTrigger();
    }

    const addPoints = (store.getState().get('points') + 10) +
      ((store.getState().get('speedRun') - 1) * 2); // 速度越快, 得分越高

    states.dispatchPoints(addPoints);

    if (isClear(matrix)) {
      if (music.clear) {
        music.clear();
      }
      return;
    }
    if (isOver(matrix)) {
      if (music.gameover) {
        music.gameover();
      }
      states.overStart();
      return;
    }
    setTimeout(() => {
      store.dispatch(actions.lock(false));
      store.dispatch(actions.moveBlock({ type: store.getState().get('next') }));
      store.dispatch(actions.nextBlock());
      states.auto();
    }, 100);
  },

  // 页面焦点变换
  focus: (isFocus) => {
    store.dispatch(actions.focus(isFocus));
    if (!isFocus) {
      clearTimeout(states.fallInterval);
      return;
    }
    const state = store.getState();
    if (state.get('cur') && !state.get('reset') && !state.get('pause')) {
      states.auto();
    }
  },

  // 暂停
  pause: (isPause) => {
    store.dispatch(actions.pause(isPause));
    if (isPause) {
      clearTimeout(states.fallInterval);
      return;
    }
    states.auto();
  },

  // 消除行
  clearLines: (matrix, lines) => {
    const state = store.getState();
    let newMatrix = matrix;
    lines.forEach(n => {
      newMatrix = newMatrix.splice(n, 1);
      newMatrix = newMatrix.unshift(List(blankLine));
    });
    store.dispatch(actions.matrix(newMatrix));
    store.dispatch(actions.moveBlock({ type: state.get('next') }));
    store.dispatch(actions.nextBlock());
    states.auto();
    store.dispatch(actions.lock(false));
    const clearLines = state.get('clearLines') + lines.length;
    store.dispatch(actions.clearLines(clearLines)); // 更新消除行

    const addPoints = store.getState().get('points') +
      clearPoints[lines.length - 1]; // 一次消除的行越多, 加分越多
    states.dispatchPoints(addPoints);

    const speedAdd = Math.floor(clearLines / eachLines); // 消除行数, 增加对应速度
    let speedNow = state.get('speedStart') + speedAdd;
    speedNow = speedNow > 6 ? 6 : speedNow;
    store.dispatch(actions.speedRun(speedNow));
  },

  // 游戏结束, 触发动画
  overStart: () => {
    clearTimeout(states.fallInterval);
    store.dispatch(actions.lock(true));
    store.dispatch(actions.reset(true));
    store.dispatch(actions.pause(false));
  },

  // 游戏结束动画完成
  overEnd: () => {
    store.dispatch(actions.matrix(blankMatrix));
    store.dispatch(actions.moveBlock({ reset: true }));
    store.dispatch(actions.reset(false));
    store.dispatch(actions.lock(false));
    store.dispatch(actions.clearLines(0));
  },

  // 写入分数
  dispatchPoints: (point) => { // 写入分数, 同时判断是否创造最高分
    store.dispatch(actions.points(point));
    if (point > 0 && point > store.getState().get('max')) {
      store.dispatch(actions.max(point));
    }
  },
};

export default states;