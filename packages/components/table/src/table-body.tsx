import {forwardRef, HTMLNextUIProps} from "@nextui-org/system";
import {useDOMRef} from "@nextui-org/dom-utils";
import {clsx, dataAttr} from "@nextui-org/shared-utils";
import {useTableRowGroup} from "@react-aria/table";
import {useMemo} from "react";
import {filterDOMProps, mergeProps} from "@react-aria/utils";

import TableRow from "./table-row";
import TableCell from "./table-cell";
import TableCheckboxCell from "./table-checkbox-cell";
import {useTableContext} from "./table-context";

const TableBody = forwardRef<HTMLNextUIProps, "tbody">((props, ref) => {
  const {as, className, ...otherProps} = props;

  const Component = as || "tbody";
  const domRef = useDOMRef(ref);

  const {slots, collection, classNames} = useTableContext();
  const {rowGroupProps} = useTableRowGroup();

  const tbodyStyles = clsx(classNames?.tbody, className);
  const bodyProps = collection.body.props;

  const renderRows = useMemo(() => {
    return [...collection.body.childNodes].map((row) => (
      <TableRow key={row.key} node={row}>
        {[...row.childNodes].map((cell) =>
          cell.props.isSelectionCell ? (
            <TableCheckboxCell key={cell.key} node={cell} rowKey={row.key} />
          ) : (
            <TableCell key={cell.key} node={cell} rowKey={row.key} />
          ),
        )}
      </TableRow>
    ));
  }, [collection.body.childNodes]);

  let emptyState;

  if (collection.size === 0 && bodyProps.renderEmptyState) {
    emptyState = (
      <tr role="row">
        <td
          className={slots?.emptyWrapper({class: classNames?.emptyWrapper})}
          colSpan={collection.columnCount}
          role="gridcell"
        >
          {bodyProps.renderEmptyState()}
        </td>
      </tr>
    );
  }

  return (
    <Component
      ref={domRef}
      {...mergeProps(rowGroupProps, filterDOMProps(bodyProps, {labelable: true}), otherProps)}
      className={slots.tbody?.({class: tbodyStyles})}
      data-empty={dataAttr(collection.size === 0)}
    >
      {renderRows}
      {emptyState}
    </Component>
  );
});

TableBody.displayName = "NextUI.TableBody";

export default TableBody;
