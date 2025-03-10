const baseApi = "http://113.31.114.7:3081/v1";
const pageSize = 20;
const resData = {
    "msg": "{\n    \"progress\": {\n        \"cur\": 363163,\n        \"max\": 363163\n    },\n    \"totalField\": {\n        \"totalFieldAmount\": 15,\n        \"fields\": [\n            {\n                \"name\": \"price\"\n            },\n            {\n                \"name\": \"cost\"\n            },\n            {\n                \"name\": \"sales\"\n            },\n            {\n                \"name\": \"profit_margin\"\n            },\n            {\n                \"name\": \"inventory\"\n            },\n            {\n                \"name\": \"discount_percentage\"\n            },\n            {\n                \"name\": \"delivery_days\"\n            },\n            {\n                \"name\": \"category\"\n            },\n            {\n                \"name\": \"material\"\n            },\n            {\n                \"name\": \"color\"\n            },\n            {\n                \"name\": \"location\"\n            },\n            {\n                \"name\": \"season\"\n            },\n            {\n                \"name\": \"store_type\"\n            },\n            {\n                \"name\": \"brand\"\n            },\n            {\n                \"name\": \"revenue\"\n            }\n        ]\n    },\n    \"dataTableHead\": [\n        {\n            \"name\": \"price\",\n            \"type\": \"number\",\n            \"index\": 0,\n            \"min\": 50.70429733616281,\n            \"max\": 499.87295297875875,\n            \"group\": [\n                {\n                    \"count\": 268,\n                    \"label\": \"50.70 - 95.62\"\n                },\n                {\n                    \"count\": 259,\n                    \"label\": \"95.62 - 140.54\"\n                },\n                {\n                    \"count\": 235,\n                    \"label\": \"140.54 - 185.45\"\n                },\n                {\n                    \"count\": 241,\n                    \"label\": \"185.45 - 230.37\"\n                },\n                {\n                    \"count\": 235,\n                    \"label\": \"230.37 - 275.29\"\n                },\n                {\n                    \"count\": 249,\n                    \"label\": \"275.29 - 320.21\"\n                },\n                {\n                    \"count\": 275,\n                    \"label\": \"320.21 - 365.12\"\n                },\n                {\n                    \"count\": 235,\n                    \"label\": \"365.12 - 410.04\"\n                },\n                {\n                    \"count\": 258,\n                    \"label\": \"410.04 - 454.96\"\n                },\n                {\n                    \"count\": 245,\n                    \"label\": \"454.96 - 499.87\"\n                }\n            ],\n            \"enums\": []\n        },\n        {\n            \"name\": \"cost\",\n            \"type\": \"number\",\n            \"index\": 1,\n            \"min\": 26.505895329330087,\n            \"max\": 447.0229108170189,\n            \"group\": [\n                {\n                    \"count\": 314,\n                    \"label\": \"26.51 - 68.56\"\n                },\n                {\n                    \"count\": 342,\n                    \"label\": \"68.56 - 110.61\"\n                },\n                {\n                    \"count\": 300,\n                    \"label\": \"110.61 - 152.66\"\n                },\n                {\n                    \"count\": 337,\n                    \"label\": \"152.66 - 194.71\"\n                },\n                {\n                    \"count\": 359,\n                    \"label\": \"194.71 - 236.76\"\n                },\n                {\n                    \"count\": 329,\n                    \"label\": \"236.76 - 278.82\"\n                },\n                {\n                    \"count\": 245,\n                    \"label\": \"278.82 - 320.87\"\n                },\n                {\n                    \"count\": 129,\n                    \"label\": \"320.87 - 362.92\"\n                },\n                {\n                    \"count\": 106,\n                    \"label\": \"362.92 - 404.97\"\n                },\n                {\n                    \"count\": 39,\n                    \"label\": \"404.97 - 447.02\"\n                }\n            ],\n            \"enums\": []\n        },\n        {\n            \"name\": \"sales\",\n            \"type\": \"number\",\n            \"index\": 2,\n            \"min\": 1,\n            \"max\": 49,\n            \"group\": [\n                {\n                    \"count\": 250,\n                    \"label\": \"1.00 - 5.80\"\n                },\n                {\n                    \"count\": 254,\n                    \"label\": \"5.80 - 10.60\"\n                },\n                {\n                    \"count\": 263,\n                    \"label\": \"10.60 - 15.40\"\n                },\n                {\n                    \"count\": 257,\n                    \"label\": \"15.40 - 20.20\"\n                },\n                {\n                    \"count\": 211,\n                    \"label\": \"20.20 - 25.00\"\n                },\n                {\n                    \"count\": 263,\n                    \"label\": \"25.00 - 29.80\"\n                },\n                {\n                    \"count\": 237,\n                    \"label\": \"29.80 - 34.60\"\n                },\n                {\n                    \"count\": 280,\n                    \"label\": \"34.60 - 39.40\"\n                },\n                {\n                    \"count\": 247,\n                    \"label\": \"39.40 - 44.20\"\n                },\n                {\n                    \"count\": 238,\n                    \"label\": \"44.20 - 49.00\"\n                }\n            ],\n            \"enums\": []\n        },\n        {\n            \"name\": \"profit_margin\",\n            \"type\": \"number\",\n            \"index\": 3,\n            \"min\": 10.01769186998245,\n            \"max\": 49.99953460978536,\n            \"group\": [\n                {\n                    \"count\": 234,\n                    \"label\": \"10.02 - 14.02\"\n                },\n                {\n                    \"count\": 262,\n                    \"label\": \"14.02 - 18.01\"\n                },\n                {\n                    \"count\": 236,\n                    \"label\": \"18.01 - 22.01\"\n                },\n                {\n                    \"count\": 255,\n                    \"label\": \"22.01 - 26.01\"\n                },\n                {\n                    \"count\": 252,\n                    \"label\": \"26.01 - 30.01\"\n                },\n                {\n                    \"count\": 230,\n                    \"label\": \"30.01 - 34.01\"\n                },\n                {\n                    \"count\": 262,\n                    \"label\": \"34.01 - 38.00\"\n                },\n                {\n                    \"count\": 264,\n                    \"label\": \"38.00 - 42.00\"\n                },\n                {\n                    \"count\": 244,\n                    \"label\": \"42.00 - 46.00\"\n                },\n                {\n                    \"count\": 261,\n                    \"label\": \"46.00 - 50.00\"\n                }\n            ],\n            \"enums\": []\n        },\n        {\n            \"name\": \"inventory\",\n            \"type\": \"number\",\n            \"index\": 4,\n            \"min\": 0,\n            \"max\": 199,\n            \"group\": [\n                {\n                    \"count\": 255,\n                    \"label\": \"0.00 - 19.90\"\n                },\n                {\n                    \"count\": 252,\n                    \"label\": \"19.90 - 39.80\"\n                },\n                {\n                    \"count\": 249,\n                    \"label\": \"39.80 - 59.70\"\n                },\n                {\n                    \"count\": 300,\n                    \"label\": \"59.70 - 79.60\"\n                },\n                {\n                    \"count\": 247,\n                    \"label\": \"79.60 - 99.50\"\n                },\n                {\n                    \"count\": 225,\n                    \"label\": \"99.50 - 119.40\"\n                },\n                {\n                    \"count\": 254,\n                    \"label\": \"119.40 - 139.30\"\n                },\n                {\n                    \"count\": 234,\n                    \"label\": \"139.30 - 159.20\"\n                },\n                {\n                    \"count\": 233,\n                    \"label\": \"159.20 - 179.10\"\n                },\n                {\n                    \"count\": 251,\n                    \"label\": \"179.10 - 199.00\"\n                }\n            ],\n            \"enums\": []\n        },\n        {\n            \"name\": \"discount_percentage\",\n            \"type\": \"number\",\n            \"index\": 5,\n            \"min\": 0.0055558588632842465,\n            \"max\": 29.99122913465493,\n            \"group\": [\n                {\n                    \"count\": 261,\n                    \"label\": \"0.01 - 3.00\"\n                },\n                {\n                    \"count\": 235,\n                    \"label\": \"3.00 - 6.00\"\n                },\n                {\n                    \"count\": 239,\n                    \"label\": \"6.00 - 9.00\"\n                },\n                {\n                    \"count\": 256,\n                    \"label\": \"9.00 - 12.00\"\n                },\n                {\n                    \"count\": 266,\n                    \"label\": \"12.00 - 15.00\"\n                },\n                {\n                    \"count\": 243,\n                    \"label\": \"15.00 - 18.00\"\n                },\n                {\n                    \"count\": 258,\n                    \"label\": \"18.00 - 21.00\"\n                },\n                {\n                    \"count\": 259,\n                    \"label\": \"21.00 - 23.99\"\n                },\n                {\n                    \"count\": 238,\n                    \"label\": \"23.99 - 26.99\"\n                },\n                {\n                    \"count\": 245,\n                    \"label\": \"26.99 - 29.99\"\n                }\n            ],\n            \"enums\": []\n        },\n        {\n            \"name\": \"delivery_days\",\n            \"type\": \"number\",\n            \"index\": 6,\n            \"min\": 1,\n            \"max\": 9,\n            \"group\": [\n                {\n                    \"count\": 293,\n                    \"label\": \"1.00 - 1.80\"\n                },\n                {\n                    \"count\": 282,\n                    \"label\": \"1.80 - 2.60\"\n                },\n                {\n                    \"count\": 283,\n                    \"label\": \"2.60 - 3.40\"\n                },\n                {\n                    \"count\": 293,\n                    \"label\": \"3.40 - 4.20\"\n                },\n                {\n                    \"count\": 0,\n                    \"label\": \"4.20 - 5.00\"\n                },\n                {\n                    \"count\": 294,\n                    \"label\": \"5.00 - 5.80\"\n                },\n                {\n                    \"count\": 260,\n                    \"label\": \"5.80 - 6.60\"\n                },\n                {\n                    \"count\": 279,\n                    \"label\": \"6.60 - 7.40\"\n                },\n                {\n                    \"count\": 270,\n                    \"label\": \"7.40 - 8.20\"\n                },\n                {\n                    \"count\": 246,\n                    \"label\": \"8.20 - 9.00\"\n                }\n            ],\n            \"enums\": []\n        },\n        {\n            \"name\": \"category\",\n            \"type\": \"enum\",\n            \"index\": 7,\n            \"min\": 1,\n            \"max\": 100,\n            \"group\": [],\n            \"enums\": [\n                {\n                    \"key\": \"Bed\",\n                    \"value\": 481\n                },\n                {\n                    \"key\": \"Chair\",\n                    \"value\": 497\n                },\n                {\n                    \"key\": \"Table\",\n                    \"value\": 533\n                },\n                {\n                    \"key\": \"Sofa\",\n                    \"value\": 488\n                },\n                {\n                    \"key\": \"Desk\",\n                    \"value\": 501\n                }\n            ]\n        },\n        {\n            \"name\": \"material\",\n            \"type\": \"enum\",\n            \"index\": 8,\n            \"min\": 1,\n            \"max\": 100,\n            \"group\": [],\n            \"enums\": [\n                {\n                    \"key\": \"Plastic\",\n                    \"value\": 492\n                },\n                {\n                    \"key\": \"Glass\",\n                    \"value\": 500\n                },\n                {\n                    \"key\": \"Metal\",\n                    \"value\": 529\n                },\n                {\n                    \"key\": \"Wood\",\n                    \"value\": 528\n                },\n                {\n                    \"key\": \"Fabric\",\n                    \"value\": 451\n                }\n            ]\n        },\n        {\n            \"name\": \"color\",\n            \"type\": \"enum\",\n            \"index\": 9,\n            \"min\": 1,\n            \"max\": 100,\n            \"group\": [],\n            \"enums\": [\n                {\n                    \"key\": \"Red\",\n                    \"value\": 419\n                },\n                {\n                    \"key\": \"Blue\",\n                    \"value\": 401\n                },\n                {\n                    \"key\": \"Black\",\n                    \"value\": 448\n                },\n                {\n                    \"key\": \"Green\",\n                    \"value\": 399\n                },\n                {\n                    \"key\": \"Brown\",\n                    \"value\": 406\n                },\n                {\n                    \"key\": \"White\",\n                    \"value\": 427\n                }\n            ]\n        },\n        {\n            \"name\": \"location\",\n            \"type\": \"enum\",\n            \"index\": 10,\n            \"min\": 1,\n            \"max\": 100,\n            \"group\": [],\n            \"enums\": [\n                {\n                    \"key\": \"Rural\",\n                    \"value\": 897\n                },\n                {\n                    \"key\": \"Suburban\",\n                    \"value\": 813\n                },\n                {\n                    \"key\": \"Urban\",\n                    \"value\": 790\n                }\n            ]\n        },\n        {\n            \"name\": \"season\",\n            \"type\": \"enum\",\n            \"index\": 11,\n            \"min\": 1,\n            \"max\": 100,\n            \"group\": [],\n            \"enums\": [\n                {\n                    \"key\": \"Spring\",\n                    \"value\": 614\n                },\n                {\n                    \"key\": \"Summer\",\n                    \"value\": 584\n                },\n                {\n                    \"key\": \"Fall\",\n                    \"value\": 651\n                },\n                {\n                    \"key\": \"Winter\",\n                    \"value\": 651\n                }\n            ]\n        },\n        {\n            \"name\": \"store_type\",\n            \"type\": \"enum\",\n            \"index\": 12,\n            \"min\": 1,\n            \"max\": 100,\n            \"group\": [],\n            \"enums\": [\n                {\n                    \"key\": \"Online\",\n                    \"value\": 1307\n                },\n                {\n                    \"key\": \"Retail\",\n                    \"value\": 1193\n                }\n            ]\n        },\n        {\n            \"name\": \"brand\",\n            \"type\": \"enum\",\n            \"index\": 13,\n            \"min\": 1,\n            \"max\": 100,\n            \"group\": [],\n            \"enums\": [\n                {\n                    \"key\": \"BrandA\",\n                    \"value\": 650\n                },\n                {\n                    \"key\": \"BrandD\",\n                    \"value\": 618\n                },\n                {\n                    \"key\": \"BrandB\",\n                    \"value\": 588\n                },\n                {\n                    \"key\": \"BrandC\",\n                    \"value\": 644\n                }\n            ]\n        },\n        {\n            \"name\": \"revenue\",\n            \"type\": \"number\",\n            \"index\": 14,\n            \"min\": -14214.56550528128,\n            \"max\": 32922.07883216713,\n            \"group\": [\n                {\n                    \"count\": 22,\n                    \"label\": \"-14214.57 - -9500.90\"\n                },\n                {\n                    \"count\": 103,\n                    \"label\": \"-9500.90 - -4787.24\"\n                },\n                {\n                    \"count\": 351,\n                    \"label\": \"-4787.24 - -73.57\"\n                },\n                {\n                    \"count\": 651,\n                    \"label\": \"-73.57 - 4640.09\"\n                },\n                {\n                    \"count\": 653,\n                    \"label\": \"4640.09 - 9353.76\"\n                },\n                {\n                    \"count\": 401,\n                    \"label\": \"9353.76 - 14067.42\"\n                },\n                {\n                    \"count\": 211,\n                    \"label\": \"14067.42 - 18781.09\"\n                },\n                {\n                    \"count\": 88,\n                    \"label\": \"18781.09 - 23494.75\"\n                },\n                {\n                    \"count\": 17,\n                    \"label\": \"23494.75 - 28208.41\"\n                },\n                {\n                    \"count\": 3,\n                    \"label\": \"28208.41 - 32922.08\"\n                }\n            ],\n            \"enums\": []\n        }\n    ]\n}"
}

const getFilterObj = (updatedDataTableHead,seledColumns,pageNo = 0) => {
    console.log(updatedDataTableHead,seledColumns);
    // 提取 filter, selEnums, sort 不为空的元素
    const filteredItems = updatedDataTableHead?.filter(item => item.filter || item.selEnums || item.sort);
    // 过滤掉 type 为 date 的元素
    const filteredItemsWithoutDate = filteredItems?.filter(item => item.type !== 'date');
    // 找到第一个 sort 字段不为空的元素
    const sortItem = filteredItems?.find(item => item.sort);
    // 构建 filterObj
    const filterObj = {
        query: {
            field_name: seledColumns.map(item => item.field), // 全量的 item.index
            where: filteredItemsWithoutDate?filteredItemsWithoutDate.map(item => ({
                field_name: item.field, // 要筛选的字段的 item.index
                field_conditions: [
                    ...(item.filter ? [
                        {
                            operator: '>=',
                            operand: item.filter[0]
                        },
                        {
                            operator: '<=',
                            operand: item.filter[1]
                        }
                    ] : []),
                    ...(item.selEnums ? [
                        {
                            operator: '=',
                            operand: item.selEnums
                        }
                    ] : [])
                ]
            })):[],
            orderby: sortItem ? {
                field_name: sortItem.field, // 要排序的字段的 item.index
                sort_order: sortItem.sort // 值为 asc 或 desc
            }: {
                field_name:'',
                sort_order:'',
            },
            skip: pageNo * pageSize, // 分页用
            limit: pageSize
        }
    };
    return filterObj
}

const getCsvData = async(params)=>{
    // TODO: csv sort & filter & enumerate
    // const response = await fetch(`${baseApi}/uploadCsvOk`, {
    //     // mode: 'no-cors',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({"url":"http://113.31.114.7:3080/Furniture.csv", "_t":"1730807070494"}),
    // })
    // if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    // }
  
    // const dataUpload = await response.json();
    
    const res = await fetch(`${baseApi}/getCsvHead`, {
        // mode: 'no-cors',
        method: 'POST',
        body: JSON.stringify({"url":"http://113.31.114.7:3080/Furniture.csv", "_t":"1730807070494"}),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    const dataGetHead = await res.json();
    
    
    return JSON.parse(dataGetHead?.msg);
}

const getTabelData = async(params)=>{
    console.log(params);
    // TODO: csv sort & filter & enumerate
    const res = await fetch(`${baseApi}/getCsvData`, {
        // mode: 'no-cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                "inputs": {
                    "fileUrl":"http://113.31.114.7:3080/Furniture.csv", 
                    ...params
                }
            }
        ),
    })
    const tabelData = await res.json();
    return tabelData
}

const updateData = async(params)=>{
    const res = await fetch(`${baseApi}/getCsvHead`, {
        // mode: 'no-cors',
        method: 'POST',
        body: JSON.stringify({"url":"http://113.31.114.7:3080/Furniture.csv", "_t":"1730807070494"}),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    const dataGetHead = await res.json();
    
    
    return JSON.parse(dataGetHead?.msg);
    // TODO: 首次加载数据后可能不是完整数据，需要通过timer更新
    
}

export {
    getCsvData,
    getTabelData,
    updateData,
    pageSize,
    getFilterObj
}