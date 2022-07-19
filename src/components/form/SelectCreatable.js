import React, { useCallback, useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';
import styled, { css, withTheme } from 'styled-components';

import { Body } from '../typography';

const SelectCreatableEnum = {
  disabled: 'disabled',
  error: 'error',
  default: 'default',
};

const StyledCreatableSelect = styled(CreatableSelect)`
  ${props => {
    if (props.variant === SelectCreatableEnum.error) {
      // error variant style
      return css`
        div[class*='control'] {
          border-radius: 0.125rem;
          border: 1px solid ${props.theme.colors.default.status.error.primary};
        }

        div[class*='control']:focus-within {
          border: 1px solid #f5222d;
          box-shadow: 0px 0px 4px rgba(245, 34, 45, 0.5);
        }
      `;
    } else {
      // default  variant style
      return css`
        div[class*='control'] {
          border-radius: 0.125rem;
          border: 0.0625rem solid #d9d9d9;
        }

        div[class*='control']:hover {
          border: 1px solid #40a9ff;
        }

        div[class*='control']:focus-within {
          border: 1px solid #1890ff;
          box-shadow: 0px 0px 4px rgba(24, 144, 255, 0.5);
        }
      `;
    }
  }}
`;

const SelectCreatable = withTheme(({ isMulti, variant, options, onChange }) => {
  const optionsList = useMemo(
    () =>
      options?.map(optionItem => ({
        value: optionItem,
        label: optionItem,
      })) ?? [],
    [options],
  );

  const handleChange = useCallback(
    newValue =>
      onChange(newValue?.map ? newValue.map(selectedItem => selectedItem?.value) : newValue.value),
    [onChange],
  );

  return (
    <Body>
      <StyledCreatableSelect
        isMulti={isMulti}
        onChange={handleChange}
        options={optionsList}
        variant={variant}
        isDisabled={variant === SelectCreatableEnum.disabled}
      />
    </Body>
  );
});

export { SelectCreatable, SelectCreatableEnum };
