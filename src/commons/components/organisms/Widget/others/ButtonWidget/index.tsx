import React, { FC, Fragment, useState, useEffect, useRef } from 'react';
import { Box, ButtonBase } from '@mui/material';
import TinyPreview from 'commons/components/organisms/TinyEditor/Preview';
import ChangeStateDialog from 'commons/components/organisms/dialogs/ChangeStateDialog';
import { WidgetModes } from '../..';
import ButtonWidgetEditor from './edit';
import useChangeState from 'commons/hooks/fsm/useChangeState';
import useSubmitButton from 'commons/hooks/useSubmitButton';
import extractSvgPath from 'commons/utils/extractSVGPath';

type ButtonWidgetPropsType = {
  label: string;
  background_image: string;
  destination_page_url: string;
  destination_states: string[];
  mode: WidgetModes;
  id: string;
};

const ButtonWidget: FC<ButtonWidgetPropsType> = ({
  label,
  background_image,
  destination_page_url,
  destination_states = [],
  mode,
  id: widgetId,
  ...objectFields
}) => {
  const [openChangeStateDialog, setOpenChangeStateDialog] = useState(false);
  const [changeState, changeStateResult] = useChangeState();
  const [submitButton, submitButtonResult] = useSubmitButton();
  const [clipPath, setClipPath] = useState<string>('');

  useEffect(() => {
    if (background_image.endsWith('.svg')) {
      extractSvgPath(background_image).then((pathData) => {
        if (pathData) {
          setClipPath(`path('${pathData}')`);
        }
      }).catch((error) => {
        console.error('Error loading SVG:', error);
      });
      fetch(background_image)
        .then(response => response.text())
        .then(svgContent => {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
          const svgElement = svgDoc.documentElement;

          const width = svgElement.getAttribute('width') || 0;
          const height = svgElement.getAttribute('height') || 0;

          if (!width || !height) {
            const viewBox = svgElement.getAttribute('viewBox');
            if (viewBox) {
              const viewBoxValues = viewBox.split(' ');
              setDimensions({
                width: parseFloat(viewBoxValues[2]),
                height: parseFloat(viewBoxValues[3]),
              });
            }
          } else {
            setDimensions({ width: parseFloat(width), height: parseFloat(height) });
          }
        })
        .catch(error => { });
    }
    else {
      const img = new Image();
      img.src = background_image;
      img.onload = function () {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setClipPath('none');
      }
    }
  }, [background_image]);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleClick = () => {
    if (mode === WidgetModes.Edit || mode === WidgetModes.Disable) {
      return;
    }
    if (destination_states.length === 1) {
      changeState({
        destinationStateId: destination_states[0],
        clickedButtonId: widgetId,
      });
      return;
    }
    if (destination_states.length > 1) {
      setOpenChangeStateDialog(true);
      return;
    }
    if (destination_page_url) {
      window.location.href = destination_page_url;
      return;
    }
    submitButton({
      clickedButtonId: widgetId,
    });
  };

  return (
    <Fragment>
      <Box
        sx={{
          position: 'relative',
          minHeight: background_image ? 40 : 60,
          width: '100%',
          height: '100%',
          display: 'inline-block',
          transform: `scale(${400 / dimensions.height})`,
        }}
      >
        <ButtonBase
          onClick={handleClick}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: 1,
            width: dimensions.width,
            height: dimensions.height,
            backgroundImage: `url(${background_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: 0,
            textTransform: 'none',
            zIndex: 0,
            clipPath,
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <TinyPreview
            styles={{ width: '100%' }}
            content={label}
          />
        </Box>
      </Box>
      <ChangeStateDialog
        open={openChangeStateDialog}
        handleClose={() => setOpenChangeStateDialog(false)}
        stateIds={destination_states}
        widgetId={widgetId}
      />
    </Fragment>
  );
};

export default ButtonWidget;
export { ButtonWidgetEditor };
