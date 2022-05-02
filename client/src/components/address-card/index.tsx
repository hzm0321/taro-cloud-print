import React, { useCallback } from "react";
import { View, Image, Text } from "@tarojs/components";
import ImgAddress from "@/assets/common/address.svg";
import { Icon } from "@antmjs/vantui";

import { formatArea } from "../../utils";

import styles from "./index.module.less";

interface Props {
  info: AddressDb;
  isEdit?: boolean;
  onClick?: () => void;
  handleEdit?: (arg: AddressDb) => void;
  handleDelete?: (id: string) => void;
}

const AddressCard: React.FC<Props> = ({
  info,
  handleEdit,
  handleDelete,
  isEdit,
  onClick,
}) => {
  const { area, addressDetail, consignee, phone, _id } = info;

  const handleOnClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (!isEdit && onClick) {
        onClick();
      }
    },
    [isEdit, onClick]
  );
  const handleEditClick = useCallback(
    (e) => {
      e.stopPropagation();
      handleEdit && handleEdit(info);
    },
    [handleEdit]
  );

  const handleDeleteClick = useCallback(
    (e) => {
      e.stopPropagation();
      handleDelete && handleDelete(_id);
    },
    [handleDelete]
  );

  return (
    <View className={styles.wrapper} onClick={handleOnClick}>
      <View className={styles.area}>
        <Image src={ImgAddress} className={styles.icon} />
        {consignee}
        <Text className={styles.phone}>{phone}</Text>
      </View>
      <View className={styles.detail}>
        {formatArea(area)}&nbsp;
        {addressDetail}
      </View>
      {isEdit && (
        <View className={styles.edit} onClick={handleEditClick}>
          <Icon name="edit" color="#666" />
        </View>
      )}
      {isEdit && (
        <View className={styles.close} onClick={handleDeleteClick}>
          <Icon name="cross" color="#e6e6e6" />
        </View>
      )}
    </View>
  );
};

export default AddressCard;
