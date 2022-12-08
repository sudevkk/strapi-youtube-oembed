/**
 *
 * 
 *
 */

 import React, { useState, useRef, useMemo, useEffect } from 'react';
 import PropTypes from 'prop-types';
 import { Button, Field, FieldHint, FieldError, FieldLabel, Card, CardHeader, CardBadge,
          CardAction, IconButton, CardAsset, CardTimer, CardBody, CardContent, CardTitle, CardSubtitle  } from '@strapi/design-system';
 import { useIntl } from 'react-intl';
 import { Pencil, Trash } from "@strapi/icons";
 import ImportModal from '../ImportModal';
 import getTrad from '../../utils/getTrad';
 import { isObject } from 'lodash';
 
 interface YoutubeInputValue {
  url: string;
  title: string;
  thumbnail: string;
  rawData: {
    author: string;
    html: string;
  }
 }
 
 const YoutubeEmbedInput = ({
   attribute,
   description,
   disabled,
   error,
   intlLabel,
   labelAction,
   name,
   onChange,
   required,
   value,
 }) => {
  

   const { formatMessage } = useIntl();
   const parseValue = (value) => {
     
     let parsedValue = null; 
 
     try {
       parsedValue = JSON.parse(value);
     } catch {}
     
     return parsedValue;
   };
 
   const [isOpen, setIsOpen] = useState(false);
   const [draftValue, setDraftValue] = useState<YoutubeInputValue|null>(parseValue(value));
 
   const hasValue = useMemo(() => {
      return isObject(draftValue) && draftValue['url'] ? true : false;
      },
      [draftValue]);  
 
   useEffect(() => {
     setDraftValue(parseValue(value));
   }, [value])
 
   const onImport = (data) => {
     onChange({
       target: {
         name: name,
         value: isObject(data) ? JSON.stringify(data) : null,
       },
     });
   };
 
   const openModal = () => {
     setIsOpen(true);
   };
 
   return (
      <>
        { hasValue && draftValue && (
          <>
          <Field>
          <FieldLabel action={labelAction} required={required}>
            {formatMessage(intlLabel)}
          </FieldLabel>
          </Field>
          <Card style={{
          
         }} id="first">
               <CardHeader>
                 <CardAction position="end">
                   <IconButton label="Delete" onClick={() => onImport(null)} icon={<Trash />} />
                   <IconButton label="Edit" onClick={openModal} icon={<Pencil />} />
                 </CardAction>
                 <CardAsset src={draftValue.thumbnail} />
                 <CardTimer>00:00</CardTimer>
               </CardHeader>
               <CardBody>
                 <CardContent>
                   <CardTitle>{draftValue.title}</CardTitle>
                   <CardSubtitle>{draftValue.rawData.author}</CardSubtitle>
                 </CardContent>
               </CardBody>
             </Card>
            </>
        ) }
        {!hasValue &&  <div>
          <Field>
         <FieldLabel action={labelAction} required={required}>
           {formatMessage(intlLabel)}
         </FieldLabel>
         <Button color="primary" onClick={openModal}>
             {!hasValue && (
               formatMessage(
                 {
                   id: getTrad('form.button.import'),
                   defaultMessage: 'Import',
                 }
             ))}
           </Button>
           </Field>
        </div>
          }
       <ImportModal isOpen={isOpen} value={draftValue} onToggle={() => setIsOpen(!isOpen)} onImport={onImport} />
       </>
   );
 };
 
 YoutubeEmbedInput.defaultProps = {
   description: null,
   disabled: false,
   error: null,
   labelAction: null,
   required: false,
   value: '',
 };
 
 YoutubeEmbedInput.propTypes = {
   intlLabel: PropTypes.object.isRequired,
   onChange: PropTypes.func.isRequired,
   attribute: PropTypes.object.isRequired,
   name: PropTypes.string.isRequired,
   description: PropTypes.object,
   disabled: PropTypes.bool,
   error: PropTypes.string,
   labelAction: PropTypes.object,
   required: PropTypes.bool,
   value: PropTypes.shape({
    url: PropTypes.string
  })
 };

 export default YoutubeEmbedInput;
 
