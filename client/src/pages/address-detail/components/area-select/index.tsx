import React, { useCallback, useEffect, useState } from "react";
import { omit } from "lodash";
import { View, Text } from "@tarojs/components";
import { Popup, Area } from "@antmjs/vantui";
import { areaList } from "@vant/area-data";
import { FormItemProps } from "@tarojs/components/types/common";

import { formatArea } from "@/utils";

interface Props extends FormItemProps {
  value?: Area[];
}

const AreaSelect: React.FC<Props> = ({ value, onConfirm }) => {
  useEffect(() => {
    // 过滤省市数据
    const ignoreList = [
      "150000",
      "460000",
      "540000",
      "650000",
      "710000",
      "810000",
      "820000",
    ]; // 排除内蒙古/海南/西藏/新疆/台湾/香港/澳门
    // @ts-ignore
    areaList.province_list = omit(areaList.province_list, ignoreList);
  }, []);

  const [isShowPopup, setIsShowPopup] = useState(false);

  const onClose = useCallback(() => {
    setIsShowPopup(false);
  }, []);

  const handleConfirm = useCallback(
    (e) => {
      onConfirm(e);
      onClose();
    },
    [onClose, onConfirm]
  );

  const handleSelect = useCallback(() => {
    setIsShowPopup(true);
  }, []);

  return (
    <View>
      <View onClick={handleSelect} style={{ width: "100%" }}>
        {value ? (
          formatArea(value)
        ) : (
          <Text style={{ color: "#969799" }}>请选择所在地区</Text>
        )}
      </View>
      <Popup position="bottom" show={isShowPopup} onClose={onClose}>
        <Area
          areaList={areaList}
          value={value?.[2]?.code || "110101"}
          title="选择地区"
          onConfirm={handleConfirm}
          onCancel={onClose}
        />
      </Popup>
    </View>
  );
};

export default AreaSelect;
