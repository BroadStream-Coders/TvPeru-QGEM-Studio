"use client";

import { GroupColumn } from "@/components/shared/group-column/layout/GroupColumn";
import { GroupFooter } from "@/components/shared/group-column/layout/GroupFooter";
import { RowsContainer } from "@/components/shared/group-column/components/RowsContainer";
import { QuickLoad } from "@/components/shared/group-column/components/QuickLoad";
import { Row, RowData } from "./Row";

interface ColumnProps {
  index: number;
  rows: RowData[];
  onUpdateRow: (rowIndex: number, updates: Partial<RowData>) => void;
  onRemoveColumn: () => void;
  onQuickLoad: (data: string[][]) => void;
}

export function Column({
  index,
  rows,
  onUpdateRow,
  onRemoveColumn,
  onQuickLoad,
}: ColumnProps) {
  return (
    <GroupColumn index={index} onRemove={onRemoveColumn}>
      <RowsContainer>
        {rows.map((row, rowIdx) => (
          <Row
            key={row.id}
            index={rowIdx}
            data={row}
            onChange={(updates) => onUpdateRow(rowIdx, updates)}
          />
        ))}
      </RowsContainer>

      <GroupFooter>
        <QuickLoad
          onLoad={onQuickLoad}
          placeholder="Pegar pregunta y respuesta (2 columnas)..."
        />
      </GroupFooter>
    </GroupColumn>
  );
}
