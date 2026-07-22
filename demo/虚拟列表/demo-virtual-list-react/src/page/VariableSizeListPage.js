import VariableSizeList from '../ component/VariableSizeList';

const rowSizes = new Array(50)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 55));
const getItemSize = index => rowSizes[index];

const Row = ({ index, style }) => {
  return (
    <div
      className={index % 2 ? 'list-item-odd' : 'list-item-even'}
      style={style}
    >
      Row {index}
    </div>
  );
};

const VariableSizeListPage = () => {
  return (
    <VariableSizeList
      className='list'
      height={200}
      width={200}
      itemSize={getItemSize}
      itemCount={1000}
    >
      {Row}
    </VariableSizeList>
  );
};

export default VariableSizeListPage;
