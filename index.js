export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'kibana_auto_complete_example',
    uiExports: {
      hacks: [
        'plugins/kibana_auto_complete_example/hack'
      ],
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
  });
}
