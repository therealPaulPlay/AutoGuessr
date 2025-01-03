<script>
</script>

<label class="switch">
    <input type="checkbox" />
    <span class="switch-slider round"></span>
</label>

<style>
    /* The switch - the box around the slider */
    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
    }

    /* Hide default HTML checkbox */
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* The slider */
    .switch-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 34px;
        background-color: #ccc;
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    .switch-slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    input:checked + .switch-slider {
        background-color: var(--default-button);
    }

    input:focus + .switch-slider {
        box-shadow: 0 0 1px #2196f3;
    }

    input:checked + .switch-slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }

    /* Rounded sliders */
    .switch-slider.round {
        border-radius: 9999px;
    }

    .switch-slider.round:before {
        border-radius: 50%;
    }
</style>
