<div class="row">
	<div class="col-lg-10">
		<div class="panel panel-default">
			<div class="panel-heading" style="font-size:20px">设置</div>
			<div class="panel-body">
				<form role="form" class="reply2see">
					<div class="form-group">
						<label for="title">设置部分隐藏模版</label>
						<p>如果这个帖子设置为回复才可见，需要制定标题模版和内容模版</p>
						<p>标题模版包括的内容，例如<code>XXXX回复可见贴</code> 如果标题不符合，全部内容都会隐藏。</p>
						<input type="text" id="title" name="title" title="Title" class="form-control" placeholder="回复可见"><br />
						<p>内容模版中符合相关内容将会被隐藏，缺省设置为<code>&ltp class="rtos"&gtXXXXX&lt\p&gt</code> 其中的XXXXX内容将会被隐藏，回复后才可见。这个不需要额外设置。</p>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="col-lg-2">
		<div class="panel panel-default">
			<div class="panel-body">
				<button class="btn btn-primary" id="save">保存配置</button>
			</div>
		</div>
	</div>
</div>