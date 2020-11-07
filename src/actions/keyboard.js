import * as reducerType from '../unit/reducerType';

/** 
 * space bar 누르면 보내지는 action
 */
function drop(data) {
  return {
    type: reducerType.KEY_DROP,
    data,
  };
}

/** 
 * 아래키를 누르면 보내지는 action
 */
function down(data) {
  return {
    type: reducerType.KEY_DOWN,
    data,
  };
}

/** 왼쪽키를 누르면 보내지는 action */
function left(data) {
  return {
    type: reducerType.KEY_LEFT,
    data,
  };
}

/** 오른쪽키를 누르면 보내지는 action */
function right(data) {
  return {
    type: reducerType.KEY_RIGHT,
    data,
  };
}

/** 위키를 누르면 보내지는 action */
function rotate(data) {
  return {
    type: reducerType.KEY_ROTATE,
    data,
  };
}

/** reset버튼을 누르면 보내지는 action */
function reset(data) {
  return {
    type: reducerType.KEY_RESET,
    data,
  };
}

/** music on/off 버튼을 누르면 보내지는 action */
function music(data) {
  return {
    type: reducerType.KEY_MUSIC,
    data,
  };
}

/** 일시정지 버튼을 누르면 보내지는 action */
function pause(data) {
  return {
    type: reducerType.KEY_PAUSE,
    data,
  };
}

export default {
  drop,
  down,
  left,
  right,
  rotate,
  reset,
  music,
  pause,
};
