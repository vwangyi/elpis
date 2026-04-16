import DynamicSizeList from '../ component/DynamicSizeList';

const items = [];
const itemCount = 1000;
for (let i = 0; i < itemCount; i++) {
  const height = 30 + Math.floor(Math.random() * 30);
  const style = {
    height,
    width: '100%'
  };
  items.push(
    <div className={i % 2 ? 'list-item-odd' : 'list-item-even'} style={style}>
      Row {i}
    </div>
  );
}

const Row = ({ index }) => items[index];

const DynamicSizeListPage = () => {
  // 注意：这里我没有把itemSize传过去
  return (
    <DynamicSizeList
      className='list'
      height={200}
      width={200}
      itemCount={itemCount}
      isDynamic
    >
      {Row}
    </DynamicSizeList>
  );
};

export default DynamicSizeListPage;
