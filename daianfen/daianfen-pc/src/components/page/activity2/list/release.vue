<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div class="tabbar">
      <div class="item" :class="{'active': i + 1 === activeIndex}" v-for="(item, i) in tabbar" :key="i" @click="handleSelect(item.index)">
        {{item.name}}
      </div>
      <el-button type="primary" size="mini" class="back" @click="back()">返回</el-button>
    </div>
    <div class="context-box" :style="{'height': `${areaHeight}px`}" ref="context">
      
      <div v-show="activeIndex === 1">
        <!-- 基础设置 -->
        <div class="setting">
          <p class="title">基础设置</p>
          <el-form :model="model" ref="base" label-position="top" size="small">
            <el-form-item label="活动名称" prop="title" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.title" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-form-item label="活动分类" prop="categoryId" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline right">
                <el-select v-model="model.categoryId" size="small">
                  <el-option :label="item.name" :value="item.id" v-for="(item, i) in category" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标签" class="inline">
                <el-select v-model="model.activityTagLists" size="small" multiple>
                  <el-option :label="item.name" :value="item.id" v-for="(item, i) in tag" :key="i"></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="优惠券规则" v-if="base.coupon">
              <el-select v-model="model.couponRuleId" size="small" clearable>
                <el-option :label="item.couponTitle" :value="item.id" v-for="(item, i) in couponRule" :key="i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主办方">
              <el-input size="small" v-model="model.sponsor" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="承办方">
              <el-input size="small" v-model="model.organizer" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="城市" prop="city" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.city" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="活动地点" prop="place" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.place" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="address" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.address" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="封面大图" prop="iconUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
              <div class="upload-img-box" @click="openImgBox('radio', 'iconUrl')">
                <img v-if="model.iconUrl" :src="`${imgHost}/${model.iconUrl}`" style="width: 120px;">
                <i v-else class="el-icon-plus upload-icon"></i>
              </div>
            </el-form-item>
            <el-form-item label="活动简介" prop="info" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.info" type="textarea" :rows="4" style="width:780px;"></el-input>
            </el-form-item>
            <el-form-item label="活动内容" prop="content" :rules="[{ required: true, message: '该字段不能为空'}]">
              <editor :content="model.content" @get-content="getContent" ></editor>
            </el-form-item>
          </el-form>
        </div>
        <!-- 时间设置 -->
        <div class="setting">
          <p class="title">时间设置</p>
          <el-form :model="model" ref="time" label-position="top" size="small">
            <el-form-item label="活动时间" prop="startTime" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-date-picker
                :editable="false"
                v-model="datetime.modelDatetime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="报名时间" prop="activitySignSetting.signStartTime" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-date-picker
                :editable="false"
                v-model="datetime.signDatetime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <!-- 报名人数设置 -->
        <div class="setting">
          <p class="title">报名人数设置</p>
          <el-form :model="model.activitySignSetting" ref="signNum" label-position="top" size="small">
            <el-form-item>
              <el-form-item label="最大人数" prop="maxNum" :rules="{ required: true, message: '该字段不能为空'}" class="inline right">
                <el-input-number size="small" :min="1" v-model="model.activitySignSetting.maxNum" type="number" style="width:200px;"></el-input-number>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <!-- 活动收费设置 -->
        <div class="setting">
          <p class="title">活动收费设置</p>
          <el-form :model="model" label-position="top" size="small">
            <el-form-item >
              <el-switch :disabled="$route.query.isRelease === 'true'" v-model="model.isEnableFee" active-text="开启付费" active-color="#409EFF" inactive-color="#e8e8e8"></el-switch>
            </el-form-item>
            <div style="margin-bottom: 18px;" v-if="model.isEnableFee">
              <el-form-item label="价格" prop="activityFee.price" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input type="number" size="small" v-model="model.activityFee.price" style="width: 200px;"></el-input>
              </el-form-item>
              <!-- <el-form-item label="VIP价格" prop="activityFee.vipPrice" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input size="small" v-model="model.activityFee.vipPrice" type="number" style="width: 200px;"></el-input>
              </el-form-item> -->
              <el-form-item v-if="false">
                <!-- <el-checkbox v-model="model.activityFee.isPromotion">开启促销</el-checkbox> -->
                <el-switch v-model="model.activityFee.isPromotion" active-text="开启促销" active-color="#409EFF" inactive-color="#e8e8e8"></el-switch>
              </el-form-item>
              <el-form-item v-if="model.activityFee.isPromotion" label="促销价格" prop="activityFee.promotionPrice" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input size="small" v-model="model.activityFee.promotionPrice" type="number" style="width: 200px;"></el-input>
              </el-form-item>
              <el-form-item v-if="model.activityFee.isPromotion" label="促销时间" prop="activityFee.promotionStartTime" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-date-picker
                  :editable="false"
                  v-model="datetime.feeDatetime"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!-- 留言设置 -->
        <div class="setting">
          <p class="title">留言设置</p>
          <el-form :model="model" ref="model" label-position="top" size="small">
            <el-form-item>
              <el-form-item class="inline right">
                <el-switch v-model="model.isEnableComment" active-text="开启评论" active-color="#409EFF" inactive-color="#e8e8e8"></el-switch>
              </el-form-item>
              <el-form-item class="inline" v-if="model.isEnableComment">
                <el-switch v-model="model.isEnableCommentAudit" active-text="开启评论审核" active-color="#409EFF" inactive-color="#e8e8e8"></el-switch>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="activeIndex === 2">
        <!-- 报名人数限制 -->
        <div class="setting" v-if="true">
          <p class="title">报名人数限制</p>
          <el-form :model="model.activitySignSetting" ref="signLimit" label-position="top" size="small">
            <el-form-item>
              <el-form-item label="单人可报名人数" prop="singleNum" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline right">
                <el-input-number size="small" :min="1" v-model="model.activitySignSetting.singleNum" type="number" style="width:200px;"></el-input-number>
              </el-form-item>
              <el-form-item v-if="base.comment" label="报名会员等级(0表示不限制等级)" prop="vipLevel" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline">
                <el-input-number size="small" v-model="model.activitySignSetting.vipLevel" type="number" style="width:200px;"></el-input-number>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <!-- 报名限制 -->
        <div class="setting" v-if="true">
          <p class="title">报名限制</p>
          <el-form :model="model.activitySignSetting" ref="unsignEndTime" label-position="top" size="small">
            <el-form-item>
              <el-switch v-model="model.activitySignSetting.isNeedSubscribe" active-text="是否需要关注公众号" active-color="#409EFF" inactive-color="#e8e8e8" class="right"></el-switch>
              <el-switch v-model="model.activitySignSetting.isEnableAudit" active-text="报名是否需要审核" active-color="#409EFF" inactive-color="#e8e8e8"></el-switch>
            </el-form-item>
            <!-- <el-form-item> 
              <el-form-item label="" >
                <el-switch v-model="model.activitySignSetting.isEnableUnsign" active-text="是否开启取消报名" active-color="#409EFF" inactive-color="#e8e8e8"></el-switch>
              </el-form-item>
              <el-form-item v-if="model.activitySignSetting.isEnableUnsign" label="取消报名结束时间" prop="signEndTime" :rules="[{ required: true, message: '该字段不能为空'}]" >
                <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="model.activitySignSetting.unsignEndTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
              </el-form-item>
            </el-form-item> -->
          </el-form>
        </div>
        <!-- 报名提醒设置 -->
        <div class="setting">
          <p class="title">报名提醒设置</p>
          <el-form :model="model.activitySignSetting" ref="signRemind" label-position="top" size="small">
            <el-form-item label="报名成功信息" prop="signMsg" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.activitySignSetting.signMsg" type="textarea" style="width:500px;"></el-input>
            </el-form-item>
            <el-form-item label="审核通过信息" prop="auditPassMsg" :rules="[{ required: true, message: '该字段不能为空'}]" v-if="model.activitySignSetting.isEnableAudit">
              <el-input size="small" v-model="model.activitySignSetting.auditPassMsg" type="textarea" style="width:500px;"></el-input>
            </el-form-item>
            <el-form-item label="审核不通过信息" prop="auditNotPassMsg" :rules="[{ required: true, message: '该字段不能为空'}]" v-if="model.activitySignSetting.isEnableAudit">
              <el-input size="small" v-model="model.activitySignSetting.auditNotPassMsg" type="textarea" style="width:500px;"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 提醒信息设置 -->
        <div class="setting">
          <p class="title">提醒信息设置</p>
          <el-form :model="model.activitySignSetting" label-position="top" size="small">
            <el-form-item label="" prop="isEnableRemindMsg" class="inline right">
              <el-switch v-model="model.activitySignSetting.isEnableRemindMsg" active-text="提醒信息" active-color="#409EFF" inactive-color="#e8e8e8" class="right"></el-switch>

              <!-- <el-switch v-model="model.activitySignSetting.isEnableRemindStart" v-if="model.activitySignSetting.isEnableRemindMsg" active-text="提醒活动开始" active-color="#409EFF" inactive-color="#e8e8e8" class="right"></el-switch> -->

              <!-- <el-switch v-model="model.activitySignSetting.isEnableSmsRemind" v-if="model.activitySignSetting.isEnableRemindMsg" active-text="手机短信通知" disabled active-color="#409EFF" inactive-color="#e8e8e8" class="right"></el-switch> -->

              <el-switch v-model="model.activitySignSetting.isEnableWxRemind" v-if="model.activitySignSetting.isEnableRemindMsg" active-text="微信客服接口通知" active-color="#409EFF" inactive-color="#e8e8e8" class="right"></el-switch>

              <el-switch v-model="model.activitySignSetting.isEnableWxTemplateRemind" v-if="model.activitySignSetting.isEnableRemindMsg" active-text="微信模板消息通知" active-color="#409EFF" inactive-color="#e8e8e8"></el-switch>
            </el-form-item>
          </el-form>
        </div>
        <!-- 报名自定义字段设置 -->
        <div class="setting">
          <p class="title">报名自定义字段设置</p>
          <p class="desc">
            <span>输入类型为单选或多选时起效。备选项，以下划线分隔。</span>
          </p>
          <table cellpadding="0" cellspacing="0" class="act-table">
            <tr>
              <th>序号</th>
              <th>输入类型</th>
              <th>显示名称</th>
              <th>对应会员字段</th>
              <th>选项</th>
              <th>必填</th>
              <th>显示在前端</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, i) in model.signDataSettingList" :key="i">
              <td>
                <el-input-number size="mini" v-model="item.sort" style="width: 100px;" :disabled="model.isRelease"></el-input-number>
              </td>
              <td>
                <el-select v-model="item.type" placeholder="请选择" size="mini" style="width: 120px;" :disabled="item.id && item.id !== ''  || model.isRelease">
                  <el-option v-for="(item, i) in inputType" :key="i" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-input v-model="item.name" placeholder="请输入内容" size="mini" style="width: 150px;" :disabled="model.isRelease"></el-input>
              </td>
              <td>
                <el-input v-model="item.fieldName" placeholder="请输入内容" size="mini" style="width: 150px;" :disabled="item.id && item.id !== ''  || model.isRelease"></el-input>
              </td>
              <td>
                <el-input :disabled="item.type !== 2 && item.type !== 3 || model.isRelease" v-model="item.options" placeholder="请输入内容" size="mini" style="width: 200px;"></el-input>
              </td>
              <td>
                <el-switch v-model="item.isRequired" active-text="" active-color="#409EFF" inactive-color="#e8e8e8" :disabled="model.isRelease"></el-switch>
              </td>
              <td>
                <el-switch v-model="item.isShow" active-text="" active-color="#409EFF" inactive-color="#e8e8e8" :disabled="model.isRelease"></el-switch>
              </td>
              <td>
                <el-button type="danger" size="mini" @click="delDataSetting(i)" :disabled="model.isRelease">删除</el-button>
              </td>
            </tr>
            <el-button type="primary" size="mini" class="add" @click="addDataSetting()" :disabled="model.isRelease">新增</el-button>
          </table>
        </div>
      </div>
      <div v-show="activeIndex === 3">
        <el-form label-position="top" size="small" style="margin-bottom: 22px;" >
          <el-form-item label="">
            <el-switch v-model="model.activityCheckinSetting.isCheckin" active-text="设置活动签到" active-color="#409EFF" inactive-color="#e8e8e8"></el-switch>
          </el-form-item>
        </el-form>
        <div v-if="model.activityCheckinSetting.isCheckin">
          <!-- 签到时间设置 -->
          <div class="setting">
            <p class="title">签到时间设置</p>
            <table cellpadding="0" cellspacing="0" class="act-table">
              <tr>
                <th style="width: 220px;">签到开始时间</th>
                <th style="width: 220px;">签到结束时间</th>
                <th style="width: 220px;">签到迟到时间</th>
                <th style="width: 80px;">操作</th>
              </tr>
              <tr v-for="(item, i) in model.activityCheckinSetting.checkinTimeList" :key="i">
                <td>
                  <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="item.checkinStartTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
                </td>
                <td>
                  <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="item.checkinEndTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
                </td>
                <td>
                  <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="item.checkinLateTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
                </td>
                <td>
                  <el-button type="danger" size="mini" @click="delCheckTime(i)">删除</el-button>
                </td>
              </tr>
              <el-button type="primary" size="mini" class="add" @click="addCheckTime()">新增</el-button>
            </table>
          </div>
          <!-- 签到提醒设置 -->
        <div class="setting">
          <p class="title">签到提醒设置</p>
          <el-form :model="model.activityCheckinSetting" label-position="top" size="small">
            <el-form-item label="" prop="isEnableRemindMsg" class="inline right">
              <el-switch v-model="model.activityCheckinSetting.isEnableRemindMsg" active-text="提醒信息" active-color="#409EFF" inactive-color="#e8e8e8" class="right"></el-switch>

              <!-- <el-switch v-model="model.activityCheckinSetting.isEnableSmsRemind" v-if="model.activityCheckinSetting.isEnableRemindMsg" active-text="手机短信通知" active-color="#409EFF" inactive-color="#e8e8e8" class="right"></el-switch> -->

              <el-switch v-model="model.activityCheckinSetting.isEnableWxRemind" v-if="model.activityCheckinSetting.isEnableRemindMsg" active-text="微信客服接口通知" active-color="#409EFF" inactive-color="#e8e8e8" class="right"></el-switch>

              <el-switch v-model="model.activityCheckinSetting.isEnableWxTemplateRemind" v-if="model.activityCheckinSetting.isEnableRemindMsg" active-text="微信模板消息通知" active-color="#409EFF" inactive-color="#e8e8e8"></el-switch>
            </el-form-item>
          </el-form>
        </div>
          <!-- 签到提醒回复 -->
          <div class="setting">
            <p class="title">签到提醒设置</p>
            <el-form :model="model.activityCheckinSetting" ref="checkRemind" label-position="top" size="mini">
              <el-form-item label="签到回复" prop="checkinMsg" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input size="small" v-model="model.activityCheckinSetting.checkinMsg" type="textarea" style="width:500px;"></el-input>
              </el-form-item>
              <el-form-item label="未报名直接签到信息" prop="checkinBySuddenMsg" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input size="small" v-model="model.activityCheckinSetting.checkinBySuddenMsg" type="textarea" style="width:500px;"></el-input>
              </el-form-item>
              <!-- <el-form-item label="重复签到信息" prop="checkinRepeatMsg" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input size="small" v-model="model.activityCheckinSetting.checkinRepeatMsg" type="textarea" style="width:500px;"></el-input>
              </el-form-item> -->
              <el-form-item label="签到不通过信息" prop="checkinNotPassMsg" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input size="small" v-model="model.activityCheckinSetting.checkinNotPassMsg" type="textarea" style="width:500px;"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- 签到方式设置 -->
          <div class="setting">
            <p class="title">签到方式设置</p>
            <el-form :model="model.activityCheckinSetting" label-position="top" size="mini">
              <el-form-item>
                <el-form-item label="签到暗号" prop="checkinCode" class="inline right">
                  <el-input size="small" v-model="model.activityCheckinSetting.checkinCode" style="width:200px;"></el-input>
                </el-form-item>
                <!-- <el-form-item label="签到活跃度" prop="checkinVitalityScore" class="inline">
                  <el-input-number size="small" :min="0" v-model="model.activityCheckinSetting.checkinVitalityScore" style="width:200px;"></el-input-number>
                </el-form-item> -->
              </el-form-item>
              <el-form-item>
                <el-form-item label="" class="inline right">
                  <el-switch v-model="model.activityCheckinSetting.isEnableSudden" active-text="允许未报名直接签到" active-color="#409EFF" inactive-color="#e8e8e8"></el-switch>
                </el-form-item>
                <el-form-item label="" class="inline">
                  <el-switch v-model="model.activityCheckinSetting.isEnableMobileCheckin" active-text="允许手机号码签到" active-color="#409EFF" inactive-color="#e8e8e8"></el-switch>
                </el-form-item>
              </el-form-item>
            </el-form>
          </div>
          <!-- 签到图片设置 -->
          <div class="setting" v-if="model.activityCheckinSetting.checkinCode || model.activityCheckinSetting.isEnableMobileCheckin">
            <p class="title">签到图片设置</p>
            <el-form :model="model.activityCheckinSetting" ref="checkImg" label-position="top" size="mini">
              <el-form-item label="签到背景图片" prop="checkUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
                <div class="upload-img-box" @click="openImgBox('radio', 'activityCheckinSetting.checkUrl')">
                  <img v-if="model.activityCheckinSetting.checkUrl" :src="`${imgHost}/${model.activityCheckinSetting.checkUrl}`" style="width: 120px;">
                  <i v-else class="el-icon-plus upload-icon"></i>
                </div>
              </el-form-item>
              <el-form-item label="签到成功图片" prop="successUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
                <div class="upload-img-box" @click="openImgBox('radio', 'activityCheckinSetting.successUrl')">
                  <img v-if="model.activityCheckinSetting.successUrl" :src="`${imgHost}/${model.activityCheckinSetting.successUrl}`" style="width: 120px;">
                  <i v-else class="el-icon-plus upload-icon"></i>
                </div>
              </el-form-item>
              <el-form-item label="签到失败图片" prop="failUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
                <div class="upload-img-box" @click="openImgBox('radio', 'activityCheckinSetting.failUrl')">
                  <img v-if="model.activityCheckinSetting.failUrl" :src="`${imgHost}/${model.activityCheckinSetting.failUrl}`" style="width: 120px;">
                  <i v-else class="el-icon-plus upload-icon"></i>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>     
      </div>
      <div v-show="activeIndex === 4">
        <el-form label-position="top">
          <el-form-item v-if="!model.isEnableFee"  label="是否开启子活动独立付费（开启后报名、费用等跟着子活动）">
            <el-checkbox v-model="model.isEnableAloneItem">开启开启子活动独立付费</el-checkbox>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="mini" @click="addItem()">添加子活动</el-button>
        <div class="zi" v-for="(item, i) in model.activityItemList" :key="i">
          <el-button type="danger" size="mini" class="del" @click="delItem(i)">删除该子活动</el-button>
          <el-form label-position="top" size="mini" :model="item">
            <el-form-item label="子活动名称" prop="title" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="item.title" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="活动地点" prop="place" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="item.place" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="address" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="item.address" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="info" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="item.info" type="textarea" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-form-item label="开始时间" prop="startTime" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline right">
                <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="item.startTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline">
                <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="item.endTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-form>
          <div class="setting" v-if="model.isEnableAloneItem">
            <p class="title">活动费用设置</p>
            <el-form :model="item.activityFee" label-position="top" size="mini">
              <el-form-item>
                <el-form-item label="价格" prop="price" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline right">
                  <el-input size="small" v-model="item.activityFee.price" type="number" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="VIP价格" prop="vipPrice" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline">
                  <el-input size="small" v-model="item.activityFee.vipPrice" type="number" style="width: 200px;"></el-input>
                </el-form-item>
              </el-form-item>
              <el-form-item>
                <el-form-item label="是否促销" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline right">
                  <el-radio-group v-model="item.activityFee.isPromotion">
                    <el-radio :label="false">否</el-radio>
                    <el-radio :label="true">是</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="item.activityFee.isPromotion" label="促销价格" prop="promotionPrice" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline right">
                  <el-input size="small" v-model="item.activityFee.promotionPrice" type="number" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item v-if="item.activityFee.isPromotion" label="促销开始时间" prop="promotionStartTime" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline right">
                  <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="item.activityFee.promotionStartTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
                <el-form-item v-if="item.activityFee.isPromotion" label="促销结束时间" prop="promotionEndTime" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline">
                  <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="item.activityFee.promotionEndTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
              </el-form-item>
            </el-form>
          </div>
          <div class="setting" v-if="model.isEnableAloneItem">
            <p class="title">活动报名设置</p>
            <el-form  :model="item.activitySignSetting" label-position="top" size="mini">
              <el-form-item>
                <el-form-item label="最大人数" prop="maxNum" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline right">
                  <el-input size="small" v-model="item.activitySignSetting.maxNum" type="number" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="单人可报名人数" prop="singleNum" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline right">
                  <el-input size="small" v-model="item.activitySignSetting.singleNum" type="number" style="width:200px;"></el-input>
                </el-form-item>
              </el-form-item>
            </el-form>
          </div>
          <div class="setting">
            <p class="title">活动签到设置</p>
            <div>
              <div style="display: flex;">
                <p style="color: #717171; margin-bottom: 10px;">签到时间设置</p>
              </div>
              <table cellpadding="0" cellspacing="0" class="act-table">
                <tr>
                  <th style="width: 220px;">签到开始时间</th>
                  <th style="width: 220px;">签到结束时间</th>
                  <th style="width: 220px;">签到迟到时间</th>
                  <th style="width: 80px;">操作</th>
                </tr>
                <tr v-for="(label, k) in item.activityCheckinSetting.checkinTimeList" :key="k">
                  <td>
                    <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="label.checkinStartTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
                  </td>
                  <td>
                    <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="label.checkinEndTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
                  </td>
                  <td>
                    <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="label.checkinLateTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
                  </td>
                  <td>
                    <el-button type="danger" size="mini" @click="delItemCheckTime(i, k)">删除</el-button>
                  </td>
                </tr>
                <el-button type="primary" size="mini" class="add" @click="addItemCheckTime(i)">新增</el-button>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" @click="submit()" style="margin-right: 30px;" size="small" :loading="loading">保存</el-button>
      <el-popover placement="top" width="200" trigger="click" v-if="!model.isRelease">
        <qrcode
          :value="`${this.base.baseHost}${this.itemsName}/mobile/POUND/activity/detail?wo=1&wot=2&woacm=1&mpl=1&id=${model.id}`"
          v-if="model.id"
          tag="img"
          :options="{ size: 200 }">
        </qrcode>
        <p v-if="model.id" style="text-align: center;">扫描二维码预览</p>
        <!-- <p>{{this.base.baseHost}}{{this.base.projectName()}}/mobile/POUND/activity/detail?wo=1&wot=2&woacm=1&mpl=1&id={{model.id}}</p> -->
        <el-button slot="reference" type="primary" size="small" :loading="loading" @click="submit(true)">保存并预览</el-button>
      </el-popover>
    </div>
    <image-dialog :visible="digImgWrap" uploadType="radio" imageType='activity' :imgName="imgName" @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc"></image-dialog>
    <cropper></cropper>
  </div>
</template>

<script>
import QcHeader from "common/QcHeader";
import { tableMixin } from "@/assets/js/tableMixin";
import editor from "common/editor";
import api from "api/common";
import ImageDialog from "common/ImageDialog";
import Cropper from "common/cropper";
import Qrcode from "@xkeshi/vue-qrcode";

export default {
  mixins: [tableMixin],
  components: {
    editor,
    ImageDialog,
    QcHeader,
    Cropper,
    Qrcode
  },
  data() {
    return {
      dataLoading: false,
      digImgWrap: false,
      uploadType: "radio",
      areaHeight: 0,
      tabbar: [
        { index: 1, name: "活动设置" },
        { index: 2, name: "高级设置" },
        { index: 3, name: "签到设置" }
        // { index: 4, name: '子活动设置' },
      ],
      activeIndex: 1,
      datetime: {
        modelDatetime: "",
        signDatetime: "",
        feeDatetime: ""
      },
      activityTagList: [],
      model: {
        title: "",
        status: "",
        categoryId: "",
        couponRuleId: "",
        activityTagList: [],
        activityTagLists: [],
        isRelease: false,
        iconUrl: "",
        info: "",
        sponsor: "",
        organizer: "",
        city: "",
        place: "",
        address: "",
        startTime: "",
        endTime: "",
        isEnableComment: false,
        isEnableCommentAudit: false,
        isEnableFee: false,
        isEnableAloneItem: false,
        content: "",
        activityFee: {
          price: "",
          vipPrice: "",
          isPromotion: false,
          promotionPrice: "",
          promotionStartTime: "",
          promotionStartTime: ""
        },
        activitySignSetting: {
          maxNum: 100,
          singleNum: 1,
          vipLevel: 0,
          isNeedSubscribe: false,
          isEnableAudit: false,
          signStartTime: "",
          signEndTime: "",
          isEnableUnsign: false,
          unsignEndTime: "",
          signMsg: "您已报名成功",
          auditPassMsg: "您的报名审核通过",
          auditNotPassMsg: "您的报名审核不通过",
          isEnableRemindMsg: true,
          isEnableRemindStart: true,
          isEnableSmsRemind: false,
          isEnableWxRemind: true,
          isEnableWxTemplateRemind: false
        },
        activityCheckinSetting: {
          isCheckin: false,
          isEnableRemindMsg: true,
          isEnableSmsRemind: false,
          isEnableWxRemind: true,
          isEnableWxTemplateRemind: false,
          checkinCode: "",
          isEnableSudden: false,
          isEnableMobileCheckin: false,
          checkinVitalityScore: "",
          checkinMsg: "成功签到",
          checkinBySuddenMsg: "请先报名",
          // checkinRepeatMsg: "请勿重复签到",
          checkinNotPassMsg: "签到不通过",
          checkinTimeList: [
            {
              checkinStartTime: "",
              checkinEndTime: "",
              checkinLateTime: ""
            }
          ],
          checkUrl: "",
          successUrl: "",
          failUrl: ""
        },
        signDataSettingList: [],
        activityItemList: []
      },
      inputType: [
        { name: "文本", value: 1 },
        { name: "单选", value: 2 },
        { name: "多选", value: 3 }
        // { name: '时间选择', value: 4 },
        // { name: '图片', value: 5 },
        // { name: '音乐', value: 6 },
        // { name: '文件', value: 7 },
      ],
      category: [],
      tag: [],
      couponRule: [],
      imgName: "",
      itemsName: "",
      loading: false
    };
  },
  created() {
    this.treeByTypeCategory();
    this.listTag();
    this.listCouponRule();
    if (this.$route.query.id) {
      this.dataLoading = true;
      this.getActivity(this.$route.query.id);
    } else {
      this.getSignDataSetting();
    }
  },
  mounted() {
    this.getHeights();
    window.onresize = () => {
      this.getHeights();
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    treeByTypeCategory() {
      api.treeByTypeCategory({ type: 2 }).then(res => {
        let data = res.data.data[0];
        this.listCategory(data.id);
      })
    },
    listCategory(parentId) {
      api
        .listCategory({ parentId: parentId })
        .then(res => {
          this.category = res.data.data.list;
        });
    },
    listTag() {
      api.listTag({ type: 3 }).then(res => {
        this.tag = res.data.data.list;
      });
    },
    listCouponRule() {
      api
        .listCouponRule({ pageSize: 100, pageNum: 1, ruleType: 2 })
        .then(res => {
          console.log("listCouponRule", res.data);
          this.couponRule = res.data.data.list;
        });
    },
    getActivity(id, state) {
      api.getActivity({ id: id }).then(res => {
        let data = res.data.data;
        if (data.activityCheckinSetting) {
          data.activityCheckinSetting.isCheckin = true;
        } else {
          let activityCheckinSetting = {
            isCheckin: false,
            checkinCode: "",
            isEnableSudden: false,
            isEnableMobileCheckin: false,
            checkinVitalityScore: "",
            checkinMsg: "您已签到成功",
            checkinBySuddenMsg: "您已签到成功",
            // checkinRepeatMsg: "您已重复签到",
            checkinNotPassMsg: "签到失败",
            checkinTimeList: [
              {
                checkinStartTime: "",
                checkinEndTime: "",
                checkinLateTime: ""
              }
            ]
          };
          data.activityCheckinSetting = activityCheckinSetting;
        }
        if (!data.activityFee) {
          let activityFee = {
            price: "",
            vipPrice: "",
            isPromotion: false,
            promotionPrice: "",
            promotionStartTime: "",
            promotionStartTime: ""
          };
          data.activityFee = activityFee;
        }
        data.activityTagLists = [];
        if (data.activityTagList.length > 0) {
          data.activityTagList.map(item => {
            data.activityTagLists.push(item.tagId);
          });
        }

        this.model = data;
        this.datetime.modelDatetime = [
          this.model.startTime,
          this.model.endTime
        ];
        this.datetime.signDatetime = [
          this.model.activitySignSetting.signStartTime,
          this.model.activitySignSetting.signEndTime
        ];

        if (this.model.activityFee.isPromotion)
          this.datetime.feeDatetime = [
            this.model.activityFee.promotionStartTime,
            this.model.activityFee.promotionEndTime
          ];
        if (this.model.activityFee.price)
          this.model.activityFee.price = this.model.activityFee.price / 100;
        if (this.model.activityFee.vipPrice)
          this.model.activityFee.vipPrice =
            this.model.activityFee.vipPrice / 100;
        if (this.model.activityFee.promotionPrice)
          this.model.activityFee.promotionPrice =
            this.model.activityFee.promotionPrice / 100;

        if (this.$route.query.copy === "true" && !state)
          this.model = this.copy(this.model);

        this.dataLoading = false;
      });
    },
    copy(model) {
      for (let key in model) {
        if (model[key].constructor === Array) {
          model[key].map(item => {
            for (let key in item) {
              if (
                key === "id" ||
                key === "createTime" ||
                key === "activityId"
              ) {
                delete item[key];
              }
            }
          });
        }
        if (model[key].constructor === Object) {
          for (let v in model[key]) {
            if (model[key][v].constructor === Array) {
              model[key][v].map(item => {
                for (let key in item) {
                  if (key === "checkinSettingId") {
                    delete item[key];
                  }
                }
              });
            }
            if (v === "id" || v === "createTime" || v === "activityId") {
              delete model[key][v];
            }
          }
        }
        if (key === "id" || key === "createTime" || key === "activityId") {
          delete model[key];
        }
      }
      model.isRelease = false;
      console.log("copy", model);
      return model;
    },
    getSignDataSetting() {
      api.getSignDataSetting().then(res => {
        res.data.data.map(item => {
          item.isSystem = false;
        });
        this.model.signDataSettingList = res.data.data;
        console.log(this.model.signDataSettingList);
      });
    },
    // 设置高度
    getHeights() {
      this.areaHeight = window.innerHeight - 120 - 154;
    },
    handleSelect(index) {
      if (this.activeIndex === index) return false;
      this.activeIndex = index;
      this.$refs.context.scrollTop = 0;
    },
    addDataSetting() {
      let data = {
        sort: (this.model.signDataSettingList.length + 1) * 10,
        name: "",
        fieldName: "",
        type: 1,
        options: "",
        isRequired: true,
        isShow: true,
        isSystem: false
      };
      this.model.signDataSettingList.push(data);
      console.log(this.model.signDataSettingList);
    },
    delDataSetting(i) {
      // if (i < 2) return false
      this.model.signDataSettingList.splice(i, 1);
    },
    addCheckTime(count) {
      console.log("checkinTimeList", this.model.activityCheckinSetting);
      this.model.activityCheckinSetting.checkinTimeList.push({
        checkinStartTime: "",
        checkinEndTime: "",
        checkinLateTime: ""
      });
    },
    delCheckTime(i) {
      // if (this.model.activityCheckinSetting.checkinTimeList.length === 1) {
      //   this.$message({
      //     message: '最少需要一条数据！',
      //     type: 'warning'
      //   })
      //   return false
      // }
      this.model.activityCheckinSetting.checkinTimeList.splice(i, 1);
    },
    addItem() {
      let data = {
        title: this.model.title,
        place: this.model.place,
        address: this.model.address,
        info: this.model.info,
        startTime: this.model.startTime,
        endTime: this.model.endTime,
        activityFee: {
          price: this.model.activityFee.price,
          vipPrice: this.model.activityFee.vipPrice,
          promotionPrice: this.model.activityFee.promotionPrice,
          isPromotion: this.model.activityFee.isPromotion,
          promotionStartTime: this.model.activityFee.promotionStartTime,
          promotionEndTime: this.model.activityFee.promotionEndTime
        },
        activitySignSetting: {
          maxNum: this.model.activitySignSetting.maxNum,
          singleNum: this.model.activitySignSetting.singleNum
        },
        activityCheckinSetting: {
          checkinTimeList: []
        }
      };
      this.model.activityItemList.push(data);
    },
    delItem(i) {
      this.model.activityItemList.splice(i, 1);
    },
    addItemCheckTime(i) {
      this.model.activityItemList[
        i
      ].activityCheckinSetting.checkinTimeList.push({
        checkinStartTime: "",
        checkinEndTime: "",
        checkinLateTime: ""
      });
    },
    delItemCheckTime(i, k) {
      this.model.activityItemList[
        i
      ].activityCheckinSetting.checkinTimeList.splice(i, 1);
    },
    getContent(content) {
      this.model.content = content;
    },
    // 打开图片对话框
    openImgBox(type, imgName) {
      this.uploadType = type;
      this.imgName = imgName;
      this.digImgWrap = true;
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false;
    },
    // 单张图片
    onGetImgsrc(val, imgName) {
      console.log("imgName", imgName);
      let keys = imgName.split(".");
      if (keys.length > 1) {
        this.model[keys[0]][keys[1]] = val;
      } else {
        this.model[imgName] = val;
      }
      // this.model[imgName] = val;
      console.log("imgName", this.model.activityCheckinSetting);
    },
    check() {
      let state = false;
      this.$refs.base.validate(valid => {
        state = valid;
      });
      if (!state) {
        this.$message.error("请将基础设置信息填写完整！");
        return false;
      }

      this.$refs.time.validate(valid => {
        state = valid;
      });
      if (!state) {
        this.$message.error("请将时间设置信息填写完整！");
        return false;
      }

      let thisResult = this.util.compareTime(
        this.model.activitySignSetting.signEndTime,
        this.model.endTime
      );
      console.log("thisResult", thisResult);
      if (!thisResult) {
        this.$message.error("报名结束时间不能大于活动结束时间！");
        return false;
      }

      this.$refs.signNum.validate(valid => {
        state = valid;
      });
      if (!state) {
        this.$message.error("请将报名人数设置信息填写完整！");
        return false;
      }

      this.$refs.signLimit.validate(valid => {
        state = valid
      })
      if (!state) {
        this.$message.error('请将报名人数限制信息填写完整！')
        return false
      }

      if (this.model.activitySignSetting.isEnableUnsign) {
        this.$refs.unsignEndTime.validate(valid => {
          state = valid
        })
        if (!state) {
          this.$message.error('请填写取消报名结束时间！')
          return false
        }
      }
        
      if (this.model.isEnableFee && this.model.activityFee.price === "") {
        this.$message.error("请填写收费金额！");
        return false;
      }

      if (this.model.isEnableFee && this.model.activityFee.price == 0) {
        this.$message.error("收费金额不可为0！");
        return false;
      }

      this.$refs.signRemind.validate(valid => {
        state = valid;
      });
      if (!state) {
        this.$message.error("请将报名提醒设置信息填写完整！");
        return false;
      }

      // console.log('isCheckin')
      if (this.model.activityCheckinSetting.isCheckin) {
        let checkinTimeList = this.model.activityCheckinSetting.checkinTimeList;

        for (let i = 0; i < checkinTimeList.length; i++) {
          if (!checkinTimeList[i].checkinStartTime) {
            this.$message.error("请填写签到开始时间");
            return false;
          } else if (!checkinTimeList[i].checkinEndTime) {
            this.$message.error("请填写签到结束时间");
            return false;
          } else if (!checkinTimeList[i].checkinLateTime) {
            this.$message.error("请填写签到迟到时间");
            return false;
          }
        }

        // this.$refs.checkWay.validate(valid => {
        //   state = valid;
        // });
        // if (!state) {
        //   this.$message.error("请将签到方式设置信息填写完整！");
        //   return false;
        // }

        this.$refs.checkRemind.validate(valid => {
          state = valid;
        });
        if (!state) {
          this.$message.error("请将签到提醒设置信息填写完整！");
          return false;
        }
        if (
          this.model.activityCheckinSetting.checkinCode ||
          this.model.activityCheckinSetting.isEnableMobileCheckin
        ) {
          this.$refs.checkImg.validate(valid => {
            state = valid;
          });
          if (!state) {
            this.$message.error("请将签到图片设置信息填写完整！");
            return false;
          }
        }

        if (!state) return false;
      } else {
        this.model.activityCheckinSetting.checkinTimeList = [];
      }

      return state;
    },
    submit(state) {
      if (!this.check()) return false;

      let model = JSON.parse(JSON.stringify(this.model));
      if (model.activityFee.price)
        model.activityFee.price = Math.floor(model.activityFee.price * 100);
      if (model.activityFee.vipPrice)
        model.activityFee.vipPrice = Math.floor(
          model.activityFee.vipPrice * 100
        );
      if (model.activityFee.promotionPrice)
        model.activityFee.promotionPrice = Math.floor(
          model.activityFee.promotionPrice * 100
        );
      model.activityTagList = [];
      model.activityTagLists.map(item => {
        model.activityTagList.push({ tagId: item });
      });

      if (state) model.status = 0;
      else model.status = 1;
      console.log("model", model);
      // return false
      this.loading = true;
      if (this.$route.query.copy) this.addActivity(model, state);
      else if (this.$route.query.id) this.updateActivity(model, state);
      else this.addActivity(model, state);
    },
    addActivity(model, state) {
      api
        .addActivity(model)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "保存成功",
            type: "success"
          });
          if (state) {
            this.getActivity(res.data.message, true);
          } else {
            this.$router.go(-1);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    updateActivity(model, state) {
      api
        .updateActivity(model)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          if (state) {
            this.getActivity(res.data.message, true);
          } else {
            this.$router.go(-1);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  watch: {
    "datetime.modelDatetime"(val) {
      if (val) {
        this.model.startTime = val[0];
        this.model.endTime = val[1];
      } else {
        this.model.startTime = "";
        this.model.endTime = "";
      }
    },
    "datetime.feeDatetime"(val) {
      if (val) {
        this.model.activityFee.promotionStartTime = val[0];
        this.model.activityFee.promotionEndTime = val[1];
      } else {
        this.model.activityFee.promotionStartTime = "";
        this.model.activityFee.promotionEndTime = "";
      }
    },
    "datetime.signDatetime"(val) {
      if (val) {
        this.model.activitySignSetting.signStartTime = val[0];
        this.model.activitySignSetting.signEndTime = val[1];
      } else {
        this.model.activitySignSetting.signStartTime = "";
        this.model.activitySignSetting.signEndTime = "";
      }
    },
    "model.activitySignSetting.isEnableRemindMsg"(val) {
      if (!val) {
        this.model.activitySignSetting.isEnableRemindStart = false;
        this.model.activitySignSetting.isEnableSmsRemind = false;
        this.model.activitySignSetting.isEnableWxRemind = false;
        this.model.activitySignSetting.isEnableWxTemplateRemind = false;
      }
    },
    "model.activityCheckinSetting.isEnableRemindMsg"(val) {
      if (!val) {
        this.model.activityCheckinSetting.isEnableSmsRemind = false;
        this.model.activityCheckinSetting.isEnableWxRemind = false;
        this.model.activityCheckinSetting.isEnableWxTemplateRemind = false;
      }
    },
    "model.isEnableComment"(val) {
      if (!val) {
        this.model.isEnableCommentAudit = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.tabbar {
  display: flex;
  border-bottom: 1px solid #e7eaec;
  position: relative;
  .back {
    position: absolute;
    right: 10px;
    top: 13px;
  }
  .item {
    padding: 15px 30px;
    color: #bfbfbf;
    cursor: pointer;
    span {
      font-size: 22px;
    }
  }
  .active {
    background-color: #3091f2;
    color: #fff;
  }
}
.context-box {
  padding: 20px;
  overflow: auto;
  .setting {
    margin-bottom: 30px;
    .title {
      margin-bottom: 10px;
      padding-left: 10px;
      line-height: 1;
      font-size: 18px;
      position: relative;
      &:before {
        position: absolute;
        content: "";
        border-left: 3px solid #3091f2;
        left: 0;
        top: 0;
        bottom: 0;
      }
    }
  }
}
.inline {
  display: inline-block;
  margin-bottom: 0;
}
.right {
  margin-right: 30px;
}
.right-30 {
  margin-right: 30px;
}
.zi {
  padding: 10px;
  border: 1px solid #e7eaec;
  margin-top: 20px;
  position: relative;
  .del {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
.upload-img-box {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    border-color: #409eff;
  }
  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
}
.act-table {
  border: 1px solid #dfe6ec;
  position: relative;
  .add {
    position: absolute;
    top: -35px;
    right: 0;
  }
  tr {
    &:first-child {
      background: #eef1f6;
    }
    th,
    td {
      padding: 7px 10px;
      text-align: center;
      white-space: nowrap;
    }
  }
}
.desc {
  color: #7b7b7b;
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 5px;
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
