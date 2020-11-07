import { getNextType } from '../unit';
import * as reducerType from '../unit/reducerType';
import Block from '../unit/block';
import keyboard from './keyboard';

/**
 * 다음 블럭을 준비하라는 action
 * 기본적으로 다음 블럭을 지정해 주지 않으면 랜덤 블럭을 가져온다
 */
function nextBlock(next = getNextType()) {
  return {
    type: reducerType.NEXT_BLOCK,
    data: next,
  };
}

/** 
 * 블럭을 움직이라는 action. 만약에 움직일 블럭이 없다면 새로운 블럭을 만들어서, 그녀석을 움직인다
 * reset이 true라면,,, 블럭을 움직이지 않는다....왜 ,moveBlock에서 이걸 처리하는걸까?
 * 왜 블럭을 움직이는것과 reset은 무슨 상관이 있는거지?
 */
function moveBlock(option) {
  return {
    type: reducerType.MOVE_BLOCK,
    data: option.reset === true ? null : new Block(option),
  };
}

/** 
 * speed를 start하라는건 무슨 의미지?
 */
function speedStart(n) {
  return {
    type: reducerType.SPEED_START,
    data: n,
  };
}

/** 
 * 게임 시작전에 키보드 오른쪽키 왼쪽키로 설정한 속도값을 설정하는 action
 */
function speedRun(n) {
  return {
    type: reducerType.SPEED_RUN,
    data: n,
  };
}

/** 
 * 게임 시작전에 키보드 오른쪽키 왼쪽키로 설정한 시작줄수를 설정하는 action
 */
function startLines(n) {
  return {
    type: reducerType.START_LINES,
    data: n,
  };
}

/** 
 * state.matrix를 설정하는 action. data에 메트릭스가 있다.
 * 처음에는 startLines를 바탕으로 matrix의 생김새를 결정하고
 * 게임 진행중에는 그 블럭들이 움직이고, 쌓이는거를 matrix로 지정한다.
 */
function matrix(data) {
  return {
    type: reducerType.MATRIX,
    data,
  };
}

/** 
 * state.lock을 설정한다. lock이면,,, 뭘까 pause같은걸까?
 * 나중에 알아봐야겠다.
 */
function lock(data) {
  return {
    type: reducerType.LOCK,
    data,
  };
}

/** 
 * line들을 지우는 action. data에는 뭐가 들어있을지 궁금하다...
 * 빨리 프로젝트를 진행해서 내가 만들어 보고 싶다.
 */
function clearLines(data) {
  return {
    type: reducerType.CLEAR_LINES,
    data,
  };
}

/** 
 * 사용자가 얻은 point를 업데이트하는 action
 */
function points(data) {
  return {
    type: reducerType.POINTS,
    data,
  };
}

/** 
 * max가 뭐지??? 뭐의 최대값을 지정하는걸까?
 */
function max(data) {
  return {
    type: reducerType.MAX,
    data,
  };
}

/** 
 * 게임을 reset하는 action
 */
function reset(data) {
  return {
    type: reducerType.RESET,
    data,
  };
}

/** 
 * 스페이스바를 눌러서 블럭을 바로 drop시키는 action
 * drop은 아주 빠르게 블럭을 아래로 내리는걸까, 아니면, 블럭을 맨 아래로 순간이동 시키는걸까?
 */
function drop(data) {
  return {
    type: reducerType.DROP,
    data,
  };
}

/** 
 * 게임을 잠시 멈추도록 하는 action
 */
function pause(data) {
  return {
    type: reducerType.PAUSE,
    data,
  };
}

/** 
 * 음악을 끄고 키는 action
 */
function music(data) {
  return {
    type: reducerType.MUSIC,
    data,
  };
}

/** 
 * 게임창을 활성상태로 만들거나, 비활성상태로 만드는 action
 */
function focus(data) {
  return {
    type: reducerType.FOCUS,
    data,
  };
}

export default {
  nextBlock,
  moveBlock,
  speedStart,
  speedRun,
  startLines,
  matrix,
  lock,
  clearLines,
  points,
  reset,
  max,
  drop,
  pause,
  keyboard,
  music,
  focus,
};
