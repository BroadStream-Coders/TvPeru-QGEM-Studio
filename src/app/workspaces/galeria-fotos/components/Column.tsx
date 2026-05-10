"use client";

import { GroupColumn } from "@/components/shared/group-column/layout/GroupColumn";
import { RowsContainer } from "@/components/shared/group-column/components/RowsContainer";
import { AddRowButton } from "@/components/shared/group-column/components/AddRowButton";
import { TitleInput } from "@/components/shared/group-column/components/TitleInput";
import { Row, RowData } from "./Row";

const MAX_CAPACITY = 30;

interface ColumnProps {
  index: number;
  title: string;
  onTitleChange: (value: string) => void;
  items: RowData[];
  onItemChange: (itemIndex: number, updates: Partial<RowData>) => void;
  onAddItem: () => void;
  onRemoveItem: (itemIndex: number) => void;
  onRemoveColumn: () => void;
}

export function Column({
  index,
  title,
  onTitleChange,
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onRemoveColumn,
}: ColumnProps) {
  const handleAddItem = () => {
    if (items.length >= MAX_CAPACITY) return;
    onAddItem();
  };

  return (
    <GroupColumn
      index={index}
      onRemove={onRemoveColumn}
      currentCapacity={items.length}
      maxCapacity={MAX_CAPACITY}
    >
      <TitleInput
        value={title}
        onChange={onTitleChange}
        placeholder="Nombre del grupo..."
      />

      <RowsContainer>
        {items.map((item, itemIdx) => (
          <Row
            key={item.id || itemIdx}
            index={itemIdx}
            data={item}
            onChange={(updates) => onItemChange(itemIdx, updates)}
            onRemove={() => onRemoveItem(itemIdx)}
          />
        ))}
      </RowsContainer>

      <AddRowButton onClick={handleAddItem} label="Agregar Foto" />
    </GroupColumn>
  );
}
