import { want } from '../../unit/';
import event from '../../unit/event';
import actions from '../../actions';
import states from '../states';
import { music } from '../../unit/music';

const down = (store) => {
  store.dispatch(actions.keyboard.down(true));
  if (store.getState().get('cur') !== null) {
    event.down({
      key: 'down',
      begin: 40,
      interval: 40,
      callback: (stopDownTrigger) => {
        const state = store.getState();
        if (state.get('lock')) {
          return;
        }
        if (music.move) {
          music.move();
        }
        const cur = state.get('cur');
        if (cur === null) {
          return;
        }
        if (state.get('pause')) {
          states.pause(false);
          return;
        }
        /**
         * 이 next는 뭘까?
         */
        const next = cur.fall();
        if (want(next, state.get('matrix'))) {
          /**
           * 여기서 dispatch하면 무슨 일이 일어날까?
           * store.state.cur이 바뀔거야. 그리고 화면이 다시그러져겠지
           * matrix에 블럭이 그려질거야.
           */
          store.dispatch(actions.moveBlock(next));
          /**
           * 그다음에 바로 states.auto()를 했는데,,,이게 dispatch하고 나서 auto()를 하는거라면
           * dispatch의 callback함수로 넣는게 맞지 않겠나? 이렇게 하면 비동기적으로 되서
           * 좀,, 의도치 않게 도형이 아래로 내려갈 수도 있을것 같은디
           * 
           * 아, dispatch는 동기적으로 작동한다고하네. 하기야 그럴것이, setState()랑은 다르게 그냥
           * dispatch하고, props를 싹다 전달하고, 싹다 다시그리는거니까
           */
          states.auto();
        } else {
          let matrix = state.get('matrix');
          const shape = cur.shape;
          const xy = cur.xy;
          shape.forEach((m, k1) => (
            m.forEach((n, k2) => {
              if (n && xy.get(0) + k1 >= 0) { // 竖坐标可以为负
                let line = matrix.get(xy.get(0) + k1);
                line = line.set(xy.get(1) + k2, 1);
                matrix = matrix.set(xy.get(0) + k1, line);
              }
            })
          ));
          states.nextAround(matrix, stopDownTrigger);
        }
      },
    });
  } else {
    event.down({
      key: 'down',
      begin: 200,
      interval: 100,
      callback: () => {
        if (store.getState().get('lock')) {
          return;
        }
        const state = store.getState();
        const cur = state.get('cur');
        if (cur) {
          return;
        }
        if (music.move) {
          music.move();
        }
        let startLines = state.get('startLines');
        startLines = startLines - 1 < 0 ? 10 : startLines - 1;
        store.dispatch(actions.startLines(startLines));
      },
    });
  }
};

const up = (store) => {
  store.dispatch(actions.keyboard.down(false));
  event.up({
    key: 'down',
  });
};


export default {
  down,
  up,
};
