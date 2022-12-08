
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isObject } from 'lodash';
import {
  request,
} from '@strapi/helper-plugin';
import { FormattedMessage } from 'react-intl';
import { BaseButton, ModalLayout, ModalBody, ModalHeader, ModalFooter, Typography,
        Button, Field, FieldError, FieldLabel, FieldInput, FieldHint, Stack} from '@strapi/design-system';
import getRequestUrl from '../../utils/getUrl';
import getTrad from '../../utils/getTrad';
import pluginId from '../../pluginId';
import { useIntl } from 'react-intl';

interface EmbedableVideo {
  url?: string;
}
const ImportModal = ({
  isOpen,
  onToggle,
  onImport,
  value
}) => {
  const { formatMessage } = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState('');
  const [url, setUrl] = useState('');
  const abortController = new AbortController();

  const onSubmit = async () => {
    setIsLoading(true);
    const { signal } = abortController;

    try {
      setInputError('');
      const data = await request(
        getRequestUrl(`fetch?url=${encodeURIComponent(url)}`), { method: 'GET', signal }
        );
      setIsLoading(false);
    
      if (data.error) {
        setInputError(data.error);
      } else {
        onImport(data);
        onToggle();
      }

    } catch (error) {
      setInputError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setUrl(isObject(value) && value['url'] ? value['url'] : '');

      // Focus on the input
      /*
      setTimeout(() => {
        const input = document.getElementById('oembed-form-url');
        if (input) {
          input.focus();
        }
      }, 150); */
    } 

    return () => {
      // Abort the endpoint call if we close the modal
      abortController.abort();
    };
  }, [isOpen]);

  // Submit when we hit enter on the input
  const keyPress = (e) => {
    if (e.keyCode === 13){
      e.preventDefault();
      onSubmit();
    }
  } 

  return <>
      {isOpen && <ModalLayout onClose={ onToggle } labelledBy="title">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
        <FormattedMessage id={`${pluginId}.modal.import.title`} />
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Field name="url" error={inputError}>
            
              <FieldLabel>{formatMessage({
                id: getTrad('modal.import.input.label'),
              })}</FieldLabel>
              <FieldInput
              // id="oembed-form-url"
              placeholder="Enter Video URL"
              label={formatMessage({
                id: getTrad('modal.import.input.label'),
              })}
              description={formatMessage({
                id: getTrad('modal.import.input.description'),
              })}
              validations={{
                required: true
              }}
              onChange={({ target: { value } }) => {
                setUrl(value);
              }}
              onKeyDown={keyPress}
              
              name="name"
              type="text"
              value={url}
            />
         
      </Field>
      <FieldHint />
        <FieldError />
      </ModalBody>
      <ModalFooter startActions={<Button onClick={onToggle} variant="tertiary" start>
            <FormattedMessage id="app.components.Button.cancel" />
          </Button>} endActions={<Button onClick={onSubmit} isLoading={isLoading}><FormattedMessage id={`${pluginId}.modal.import.button.import`} /></Button>} 
          />
      </ModalLayout>}
 </>
}

ImportModal.defaultProps = {
  value: {},
};

ImportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  value: PropTypes.shape({
    url: PropTypes.string
  }),
};

export default ImportModal;