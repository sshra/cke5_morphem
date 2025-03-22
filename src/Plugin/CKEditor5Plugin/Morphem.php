<?php

namespace Drupal\morphem\Plugin\CKEditor5Plugin;

use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableTrait;
use Drupal\ckeditor5\Plugin\CKEditor5PluginDefault;
use Drupal\ckeditor5\Plugin\CKEditor5PluginElementsSubsetInterface;
use Drupal\Component\Utility\Html;
use Drupal\Core\Form\FormStateInterface;
use Drupal\editor\EditorInterface;

/**
 * CKEditor 5 Morphem plugin configuration.
 *
 * @internal
 *   Plugin classes are internal.
 */
class Morphem extends CKEditor5PluginDefault implements CKEditor5PluginConfigurableInterface, CKEditor5PluginElementsSubsetInterface {

  use CKEditor5PluginConfigurableTrait;

  const T_CONTEXT = ['context' => 'MORPHEM module'];

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form['morphemClass'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Text Class', [], self::T_CONTEXT),
      '#description' => $this->t('Class of morphem container (span tag).', [], self::T_CONTEXT),
      '#default_value' => $this->configuration['morphemClass'],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    ;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $this->configuration['morphemClass'] = Html::getClass(trim($form_state->getValue('morphemClass')));
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'morphemClass' => 'morphem',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getElementsSubset(): array {
    return ['<span>', '<span class>'];
  }

  /**
   * {@inheritdoc}
   */
  public function getDynamicPluginConfig(array $static_plugin_config, EditorInterface $editor): array {
    return [
      'morphem' => $this->configuration,
    ];
  }

}
