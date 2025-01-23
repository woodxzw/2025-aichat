const getCsvData = async(params)=>{
    console.log(params);
    // TODO: csv sort & filter & enumerate
    // const response = await fetch(`/api/document?id=${block.documentId}`, {
    //     method: 'POST',
    //     body: JSON.stringify(params),
    // });
}

const getMoreData = async(params)=>{

    return {
        rows:[
            {
                "text": [
                    "test1",
                    "21",
                    "Male",
                    "Engineering",
                    "2.31",
                    "1",
                    "Entrepreneur",
                    "110024",
                    "Yes",
                    "381"
                ]
            },{
                "text": [
                    "test2",
                    "21",
                    "Male",
                    "Engineering",
                    "2.31",
                    "1",
                    "Entrepreneur",
                    "110024",
                    "Yes",
                    "381"
                ]
            }
        ]
    }
    // TODO: csv sort & filter & enumerate
    // const response = await fetch(`/api/document?id=${block.documentId}`, {
    //     method: 'POST',
    //     body: JSON.stringify(params),
    // });
}

const updateData = async(params)=>{
    console.log(`timer`);
    // TODO: 首次加载数据后可能不是完整数据，需要通过timer更新
    
}

export {
    getCsvData,
    getMoreData,
    updateData
}