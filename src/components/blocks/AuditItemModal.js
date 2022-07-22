import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { Modal, modalTypeEnum, Body } from '..';
import { convertPascalCaseToSentenceCase } from '../../utils/stringUtils';
import theme from '../../theme';

const StyledContainer = styled('div')`
  padding: 16px 21px;
  display: grid;
  grid-template-columns: 30% 30% 30%;
  justify-content: space-between;
  gap: 17px;
`;

const StyledDivider = styled('div')`
  border-bottom: 1px solid #e5e5e5;
  width: 100%;
`;

const StyledTextContainer = styled('div')`
  overflow-wrap: break-word;
`;

const AuditItemModal = ({ onClose, auditItem }) => {
  const intl = useIntl();
  const change = auditItem.change && JSON.parse(auditItem.change);

  const bodyColor =
    auditItem.type === 'INSERT'
      ? theme.colors.default.status.ok.primary
      : theme.colors.default.status.error.primary;

  console.log('auditItem', auditItem);

  return (
    <>
      <Modal
        onClose={onClose}
        modalType={modalTypeEnum.basic}
        title={intl.formatMessage({
          id: 'audit',
        })}
        body={
          <>
            <StyledContainer>
              <div>
                <div>
                  <Body size="Bold" color="#40A9FF">
                    <FormattedMessage id="table" />
                  </Body>
                </div>
                <StyledTextContainer>
                  <Body>{auditItem.table}</Body>
                </StyledTextContainer>
              </div>
              <div>
                <div>
                  <Body size="Bold" color="#40A9FF">
                    <FormattedMessage id="timestamp" />
                  </Body>
                </div>
                <StyledTextContainer>
                  <Body>
                    {dayjs(
                      auditItem.onchainConfirmationTimeStamp * 1000,
                    ).format('YYYY-MM-DD HH:mm:ss')}
                  </Body>
                </StyledTextContainer>
              </div>
              <div>
                <div>
                  <Body size="Bold" color="#40A9FF">
                    <FormattedMessage id="type" />
                  </Body>
                </div>
                <StyledTextContainer>
                  <Body>{auditItem.type}</Body>
                </StyledTextContainer>
              </div>
              <div>
                <div>
                  <Body size="Bold" color="#40A9FF">
                    <FormattedMessage id="root-hash" />
                  </Body>
                </div>
                <StyledTextContainer>
                  <Body>{auditItem.rootHash}</Body>
                </StyledTextContainer>
              </div>
              <div>
                <div>
                  <Body size="Bold" color="#40A9FF">
                    <FormattedMessage id="author" />
                  </Body>
                </div>
                <StyledTextContainer>
                  <Body>{auditItem.author}</Body>
                </StyledTextContainer>
              </div>
              <div>
                <div>
                  <Body size="Bold" color="#40A9FF">
                    <FormattedMessage id="comment" />
                  </Body>
                </div>
                <StyledTextContainer>
                  <Body>{auditItem.comment}</Body>
                </StyledTextContainer>
              </div>
            </StyledContainer>
            <StyledDivider />
            <StyledContainer>
              {Object.keys(change).map((changeItemKey, index) => (
                <div key={index}>
                  <div>
                    <Body size="Bold">
                      {convertPascalCaseToSentenceCase(changeItemKey)}
                    </Body>
                  </div>
                  <StyledTextContainer>
                    <Body color={bodyColor}>{change[changeItemKey]}</Body>
                  </StyledTextContainer>
                </div>
              ))}
            </StyledContainer>
          </>
        }
        hideButtons
      />
    </>
  );
};

export { AuditItemModal };
