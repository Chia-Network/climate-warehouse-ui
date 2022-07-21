import React, { useCallback, useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import styled, { css, withTheme } from 'styled-components';
import { useIntl } from 'react-intl';

import { Body } from '../typography';

const SelectCreatableVariantEnum = {
  disabled: 'disabled',
  error: 'error',
  default: 'default',
};

const SelectCreatableSizeEnum = {
  large: 'large',
  default: 'default',
  small: 'small',
};

const StyledCreatableSelect = styled(CreatableSelect)`
  ${props => {
    if (props.variant === SelectCreatableVariantEnum.error) {
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
  }};

  ${props => {
    if (props.size === SelectCreatableSizeEnum.large) {
      return css`
        div[class*='control'] {
          height: ${props => (props.isMulti ? 'auto' : '2.5rem')};
          font-size: 1rem;
          line-height: 1.5rem;
        }
      `;
    } else if (props.size === SelectCreatableSizeEnum.small) {
      return css`
        div[class*='control'] {
          height: ${props => (props.isMulti ? 'auto' : '1.5rem')};
          font-size: 0.875rem;
          line-height: 1.375rem;
        }
      `;
    } else {
      return css`
        div[class*='control'] {
          height: ${props => (props.isMulti ? 'auto' : '2rem')};
          font-size: 0.875rem;
          line-height: 1.375rem;
        }
      `;
    }
  }};

  ::placeholder {
    color: #8c8c8c;
  }
`;

const StyledSelect = styled(Select)`
  ${props => {
    if (props.variant === SelectCreatableVariantEnum.error) {
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
  }};

  ${props => {
    if (props.size === SelectCreatableSizeEnum.large) {
      return css`
        div[class*='control'] {
          height: ${props => (props.isMulti ? 'auto' : '2.5rem')};
          font-size: 1rem;
          line-height: 1.5rem;
        }
      `;
    } else if (props.size === SelectCreatableSizeEnum.small) {
      return css`
        div[class*='control'] {
          height: ${props => (props.isMulti ? 'auto' : '1.5rem')};
          font-size: 0.875rem;
          line-height: 1.375rem;
        }
      `;
    } else {
      return css`
        div[class*='control'] {
          height: ${props => (props.isMulti ? 'auto' : '2rem')};
          font-size: 0.875rem;
          line-height: 1.375rem;
        }
      `;
    }
  }};

  ::placeholder {
    color: #8c8c8c;
  }
`;

/* implementation example
  <SelectCreatable
    variant={
      errors.sector &&
      touched.sector &&
      SelectCreatableVariantEnum.error
    }
    size={SelectCreatableSizeEnum.large}
    onChange={val => setFieldValue('sector', val)}
    options={pickLists.projectSector}
    selected={values.sector}
    onBlur={handleBlur}
    isCreatable
  />
*/

const SelectCreatable = withTheme(
  ({
    variant,
    options,
    onChange,
    onBlur,
    isMulti = false,
    isCreatable = true,
    isClearable = true,
    placeholder,
    selected,
    size,
  }) => {
    const intl = useIntl();
    const placeholderText = useMemo(
      () =>
        placeholder ||
        ` -- ${intl.formatMessage({
          id: 'select',
        })} -- `,
      [placeholder],
    );

    const optionsList = useMemo(
      () =>
        options?.map(optionItem => ({
          value: optionItem,
          label: optionItem,
        })) ?? [],
      [options],
    );

    const value = useMemo(() => {
      if (isMulti) {
        return selected?.map(item => ({ value: item, label: item })) ?? [];
      } else {
        return selected ? { value: selected, label: selected } : '';
      }
    }, [selected]);

    const handleChange = useCallback(
      newValue => {
        if (isMulti) {
          onChange(newValue?.map(selectedItem => selectedItem.value) ?? []);
        } else {
          onChange(newValue?.value ?? '');
        }
      },
      [onChange],
    );

    return (
      <Body>
        {isCreatable && (
          <StyledCreatableSelect
            onChange={handleChange}
            options={optionsList}
            value={value}
            variant={variant}
            isDisabled={variant === SelectCreatableVariantEnum.disabled}
            onBlur={onBlur}
            size={size}
            isMulti={isMulti}
            isClearable={isClearable}
            placeholder={placeholderText}
          />
        )}
        {!isCreatable && (
          <StyledSelect
            options={optionsList}
            onChange={handleChange}
            value={value}
            isDisabled={variant === SelectCreatableVariantEnum.disabled}
            isClearable={isClearable}
            isSearchable={true}
            isMulti={isMulti}
            size={size}
            onBlur={onBlur}
            variant={variant}
            placeholder={placeholderText}
          />
        )}
      </Body>
    );
  },
);

export { SelectCreatable, SelectCreatableVariantEnum, SelectCreatableSizeEnum };
