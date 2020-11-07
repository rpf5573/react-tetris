import { List } from 'immutable';
import * as reducerType from '../../unit/reducerType';
import { lastRecord } from '../../unit/const';
import Block from '../../unit/block';

const initState = (() => {
  if (!lastRecord || !lastRecord.cur) { // 无记录 或 有记录 但方块为空, 返回 null
    return null;
  }
  const cur = lastRecord.cur;
  const option = {
    type: cur.type,
    rotateIndex: cur.rotateIndex,
    shape: List(cur.shape.map(e => List(e))),
    xy: cur.xy,
  };
  return new Block(option);
})();

const cur = (state = initState, action) => {
  switch (action.type) {
    case reducerType.MOVE_BLOCK:
      /**
       * 아니 왜 여기서 기존의 state랑 새로 들어온 action.data랑 안합치고 바로 action.data를 return 하는거지?
       */
      return action.data;
    default:
      /**
       * 아 여기서의 state도 전체 store.state가 아니라 store.state.cur 이구나!
       * 그니까 combinereduer덕분에 이런게 가능한가봐
       */
      return state;
  }
};

export default cur;
