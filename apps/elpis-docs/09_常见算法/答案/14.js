// <对象(映射)&字符串练习>提取身份信息
const provinceList = [
    {
        name: '北京市',
        id: 110000,
    },
    {
        name: '天津市',
        id: 120000,
    },
    {
        name: '河北省',
        id: 130000,
    },
    {
        name: '山西省',
        id: 140000,
    },
    {
        name: '内蒙古自治区',
        id: 150000,
    },
];

const input = '张三:11000019980101001X';
const output = {
    name: '张三',
    province: '北京市',
    birthday: '1998.1.1',
};

function getUserInfo(input, provinceList) {

    const mapping = {};

    for (const province of provinceList) {
        // province: { name: '内蒙古自治区', id: 150000 }
        mapping[province.id] = province.name;
    }

    const [name, idCard] = input.split(':');
    // name: '张三'
    // idCard: '11000019980101001X'
    const provinceId = idCard.substring(0, 6); // '110000'
    const province = mapping[provinceId]; // '北京市'

    const year = +idCard.substring(6, 10); // 1998
    const month = +idCard.substring(10, 12); // 1
    const day = +idCard.substring(12, 14); // 1

    return {
        name,
        province,
        birthday: `${ year }.${ month }.${ day }`,
    };
}

function getUserInfo(input, provinceList) {

    const [name, idCard] = input.split(':');
    // name: '张三'
    // idCard: '11000019980101001X'
    const provinceId = idCard.substring(0, 6); // '110000'
    // 目标: '110000' >>> '北京市'
    const province = provinceList.find(item => provinceId == item.id).name; // '北京市'

    const year = +idCard.substring(6, 10); // 1998
    const month = +idCard.substring(10, 12); // 1
    const day = +idCard.substring(12, 14); // 1

    return {
        name,
        province,
        birthday: `${ year }.${ month }.${ day }`,
    };
}


console.log( getUserInfo(input, mapping) );

