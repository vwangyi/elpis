import React, { useState } from 'react';

import FixedSizeListPage from './page/FixedSizeListPage';
import VariableSizeListPage from './page/VariableSizeListPage';
import DynamicSizeListPage from './page/DynamicSizeListPage';

function TabSelector() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = tabIndex => {
    setActiveTab(tabIndex);
  };

  return (
    <div>
      <div className='tab-buttons'>
        <button
          className={activeTab === 0 ? 'active' : ''}
          onClick={() => handleTabClick(0)}
        >
          元素固定高度的虚拟列表
        </button>
        <button
          className={activeTab === 1 ? 'active' : ''}
          onClick={() => handleTabClick(1)}
        >
          元素不定高度的虚拟列表
        </button>
        <button
          className={activeTab === 2 ? 'active' : ''}
          onClick={() => handleTabClick(2)}
        >
          元素动态高度的虚拟列表
        </button>
      </div>
      <div className='tab-content'>
        {activeTab === 0 && <FixedSizeListPage />}
        {activeTab === 1 && <VariableSizeListPage />}
        {activeTab === 2 && <DynamicSizeListPage />}
      </div>
    </div>
  );
}

export default TabSelector;
