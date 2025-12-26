let text = '<span style="color: #EB0C0C;">*</span>'
let null_text = '<span style="color: #EB0C0C;">&nbsp;</span>'
export default {
    drugInput: [
        // {title: '药物名称', hint: "请输入药物名称", type: "input"},
        {title:  text+'药物用法', hint: "请选择用法", list:[]},
        {title:  text+'药物剂量', hint: "请输入剂量", type: "input"},
        {title:  text+'时间间隔', hint: "请选择时间间隔", list:[]},
    ],
    nursingInput: [
        {title: text+'护理等级', required: true, hint: '请选择护理等级', list:[]},
        {title: null_text+'护理常规', required: false, hint: "请输入护理常规", type: "input"},
        {title: null_text+'膳食', required: false, hint: "请选择膳食种类（多选）", list:[], multiple: true },
        {title: null_text+'体位', required: false, hint: "请选择体位", list:[]},
        {title: null_text+'护理项目', required: false, hint: "请选择护理项目（多选）", list:[], multiple: true},
        {title: null_text+'操作',required: false, hint: "请选择操作（多选）", list:[], multiple: true},  
    ],
}
